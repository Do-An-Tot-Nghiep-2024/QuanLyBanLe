package com.bac.se.backend.services.impl;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.InvoiceMapper;
import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.mapper.ShipmentMapper;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.DateRequest;
import com.bac.se.backend.payload.request.ShipmentRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.invoice.ImportInvoice;
import com.bac.se.backend.payload.response.invoice.ImportInvoiceItemResponse;
import com.bac.se.backend.payload.response.product.ProductImportInvoiceResponse;
import com.bac.se.backend.payload.response.shipment.CreateShipmentResponse;
import com.bac.se.backend.payload.response.shipment.ProductShipmentResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.ProductPriceService;
import com.bac.se.backend.services.ShipmentService;
import com.bac.se.backend.utils.DateConvert;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipmentServiceImpl implements ShipmentService {
    private final StockRepository stockRepository;
    private final ShipmentRepository shipmentRepository;
    private final ShipmentItemRepository shipmentItemRepository;
    static final double DEFAULT_PROFIT = 0.25; // 5% profit
    private final ProductRepository productRepository;
    private final InvoiceMapper invoiceMapper;
    private final SupplierRepository supplierRepository;
    private final ProductMapper productMapper;
    private final DateConvert dateConvert;
    private final ShipmentMapper shipmentMapper;

    private final ProductPriceService productPriceService;

    static final int defaultQuantityNotify = 5;


    @Override
    @Transactional
    public CreateShipmentResponse createShipment(ShipmentRequest shipmentRequest) throws BadRequestUserException {
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

            // update price if product price is empty
            var productPrice = productPriceService.getPriceLatest(productItem.id());
            if (productPrice.productPriceId().equals(0L)) {
                ProductPrice newPrice = ProductPrice.builder()
                        .product(product)
                        .originalPrice(productItem.price())
                        .price(productItem.price() + productItem.price() * DEFAULT_PROFIT)
                        .createdAt(new Date())
                        .build();
                productPriceService.createProductPrice(newPrice);
            }
            // update price if product have new price
            if (productPrice.originalPrice() != productItem.price()) {
                ProductPrice newPrice = ProductPrice.builder()
                        .product(product)
                        .originalPrice(productItem.price())
                        .price(productItem.price() + productItem.price() * DEFAULT_PROFIT)
                        .createdAt(new Date())
                        .build();
                productPriceService.createProductPrice(newPrice);
            }
            // Lưu thông tin chi tiết lô hàng
            Stock stock = Stock.builder()
                    .notifyQuantity(defaultQuantityNotify)
                    .quantity(productItem.quantity())
                    .soldQuantity(0)
                    .build();
            // Cập nhật số lượng sản phâm trong lô hàng
            var stockSave = stockRepository.save(stock);
            shipmentItem.setStock(stockSave);
            shipmentItemRepository.save(shipmentItem);
            total = total.add(BigDecimal.valueOf(productItem.quantity()).multiply(BigDecimal.valueOf(productItem.price())));
        }
        return new CreateShipmentResponse(supplier.getName(),
                total,
                shipmentRequest.productItems(),
                shipmentSave.getCreatedAt());
    }

    @Override
    public List<ProductShipmentResponse> getShipments() {
        var shipmentPage = shipmentItemRepository.geProductInShipment();
        return shipmentPage.stream()
                .map(shipmentMapper::mapToShipmentItemResponse).toList();
    }

    @Override
    public PageResponse<ImportInvoice> getImportInvoices(Integer pageNumber, Integer pageSize,
                                                         String fromDate,
                                                         String toDate) throws ParseException {
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);
        DateRequest dateRequest = dateConvert.convertDateRequest(fromDate, toDate);
        var shipments = shipmentRepository.getShipmentsImport(pageRequest,
                dateRequest.fromDate(),
                dateRequest.toDate());
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
    public ImportInvoiceItemResponse getItemImportInvoice(Long id) {
        Object[] object = shipmentRepository.getShipmentById(id).get(0);
        List<Object[]> objectList = shipmentItemRepository.getProductsInImportInvoice(id);
        objectList.forEach(obj -> log.info("objects is {}", obj));
        List<ProductImportInvoiceResponse> productImportInvoiceResponse = objectList.stream()
                .map(productMapper::mapObjectToProductShipmentResponse).toList();
        BigDecimal total = BigDecimal.ZERO;
        for (var productShipmentResponse : productImportInvoiceResponse) {
            total = total.add(BigDecimal.valueOf(productShipmentResponse.total()));
        }
        return new ImportInvoiceItemResponse(
                object[0].toString(),
                total,
                productImportInvoiceResponse,
                (Date) object[1]
        );

    }
}
