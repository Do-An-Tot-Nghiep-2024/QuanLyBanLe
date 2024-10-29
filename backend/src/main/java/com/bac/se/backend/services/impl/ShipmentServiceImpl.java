package com.bac.se.backend.services.impl;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.InvoiceMapper;
import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.ShipmentRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.invoice.ImportInvoice;
import com.bac.se.backend.payload.response.product.ProductShipmentResponse;
import com.bac.se.backend.payload.response.shipment.ShipmentItemResponse;
import com.bac.se.backend.payload.response.shipment.ShipmentResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.ShipmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipmentServiceImpl implements ShipmentService {
    private final StockRepository stockRepository;
    private final ShipmentRepository shipmentRepository;
    private final ShipmentItemRepository shipmentItemRepository;
    private final ProductPriceRepository productPriceRepository;
    private final ProductPriceMapper productPriceMapper;
    static final double DEFAULT_PROFIT = 0.05; // 5% profit
    private final ProductRepository productRepository;
    private final InvoiceMapper invoiceMapper;
    private final SupplierRepository supplierRepository;
    private final ProductMapper productMapper;
    private final UnitRepository unitRepository;

    static final String DEFAULT_TO_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
            .format(LocalDate.now().plusDays(1));
    static final String DEFAULT_FROM_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
            .format(LocalDate.now().minusDays(2));

    static final int defaultQuantityNotify = 5;



    ///  create order shipment

    @Override
    public ShipmentResponse createShipment(ShipmentRequest shipmentRequest) throws BadRequestUserException {
        Supplier supplier = supplierRepository.findById(shipmentRequest.supplierId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với mã là: "
                                + shipmentRequest.supplierId()));
        Shipment shipment = Shipment.builder()
                .createdAt(new Date())
                .supplier(supplier)
                .build();
        // Lưu thông tin lô hàng
        var shipmentSave = shipmentRepository.save(shipment);
        BigDecimal total = BigDecimal.ZERO;
        for (var productItem : shipmentRequest.productItems()) {
            Product product = productRepository.findById(productItem.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với mã là: "
                            + productItem.id()));
            log.info("find product success");

            // Thông báo ngoại lệ nếu sản phẩm không thuộc về nh cung cấp
            if (!product.getSupplier().getId().equals(supplier.getId())) {
                throw new BadRequestUserException("Sản phẩm không thuộc về nhà cung cấp");
            }
            ShipmentItem shipmentItem = ShipmentItem.builder()
                    .quantity(productItem.quantity())
                    .exp(productItem.exp())
                    .mxp(productItem.mxp())
                    .shipment(shipmentSave)
                    .product(product)
                    .build();
            log.info("create shipment item success");
            List<Object[]> productPrices = productPriceRepository.getProductPriceLatest(
                    productItem.id(), PageRequest.of(0, 1));
            Object[] productPrice = null;
            // Tạo mới mới product price nếu không có product price
            if (productPrices.isEmpty()) {
                productPrice = new Object[]{productItem.price(), productItem.price() + productItem.price() * DEFAULT_PROFIT, 0};
                ProductPrice newProductPrice = ProductPrice.builder()
                        .product(Product.builder().id(productItem.id()).build())
                        .originalPrice(productItem.price())
                        .price(productItem.price())
                        .discountPrice(0)
                        .createdAt(new Date())
                        .build();
                productPriceRepository.save(newProductPrice);
            } else {
                productPrice = productPrices.get(0);
            }
            double oldPrice = productPriceMapper.mapObjectToProductPriceResponse(productPrice).originalPrice();
            log.info("find product price success");
            // So sánh giá nhập với giá mới nhất của sản phẩm
            if (oldPrice != productItem.price()) {
                ProductPrice newProductPrice = ProductPrice.builder()
                        .product(Product.builder().id(productItem.id()).build())
                        .originalPrice(productItem.price())
                        .price(productItem.price() + productItem.price() * DEFAULT_PROFIT)
                        .discountPrice(0)
                        .createdAt(new Date())
                        .build();
                productPriceRepository.save(newProductPrice);

            }
            // Lưu thông tin chi tiết lô hàng
            Stock stock = Stock.builder()
                    .notifyQuantity(defaultQuantityNotify)
                    .quantity(productItem.quantity())
                    .failedQuantity(0)
                    .soldQuantity(0)
                    .build();
            // Cập nhật số lượng sản phâm trong lô hàng
            var stockSave = stockRepository.save(stock);
            shipmentItem.setStock(stockSave);
            shipmentItemRepository.save(shipmentItem);
            total = total.add(BigDecimal.valueOf(productItem.quantity()).multiply(BigDecimal.valueOf(productItem.price())));
        }
        return new ShipmentResponse(supplier.getName(),
                total,
                shipmentRequest.productItems(),
                shipmentSave.getCreatedAt());
    }

    @Override
    public PageResponse<ImportInvoice> getImportInvoices(Integer pageNumber, Integer pageSize,
                                                         String fromDate,
                                                         String toDate) throws ParseException {
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date from = fromDate != null ? dateFormat.parse(fromDate) : dateFormat.parse(DEFAULT_FROM_DATE);
        Date to = toDate != null ? dateFormat.parse(toDate) : dateFormat.parse(DEFAULT_TO_DATE);
        log.info("from: {} ",from);
        log.info("to: {}",to);
        var shipments = shipmentRepository.getShipments(pageRequest, from, to);
        var content = shipments.getContent();
        var response = content.stream().map(invoiceMapper::mapObjectToImportInvoice).toList();
        return new PageResponse<>(
                response,
                pageNumber,
                shipments.getTotalPages(),
                shipments.getTotalElements(),
                shipments.isLast()
        );
    }

    @Override
    public ShipmentItemResponse getShipment(Long id) {
        Object[] object = shipmentRepository.getShipmentById(id).get(0);
        List<Object[]> objectList = shipmentItemRepository.getProductsByShipmentId(id);
        objectList.forEach(obj -> log.info("objects is {}", obj));
        List<ProductShipmentResponse> productShipmentResponses = objectList.stream()
                .map(productMapper::mapObjectToProductShipmentResponse).toList();
        BigDecimal total = BigDecimal.ZERO;
        for (var productShipmentResponse : productShipmentResponses) {
            total = total.add(BigDecimal.valueOf(productShipmentResponse.total()));
        }
        return new ShipmentItemResponse(
                object[0].toString(),
                total,
                productShipmentResponses,
                (Date) object[1]
        );

    }
}
