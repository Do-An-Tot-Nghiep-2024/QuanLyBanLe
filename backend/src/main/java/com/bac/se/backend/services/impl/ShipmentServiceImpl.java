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
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipmentServiceImpl implements ShipmentService {
    private final StockRepository stockRepository;
    private final ShipmentRepository shipmentRepository;
    private final ShipmentItemRepository shipmentItemRepository;
    private final ProductPriceRepository productPriceRepository;
    private final ProductPriceMapper productPriceMapper;
    static final double DEFAULT_PROFIT = 0.2;
    private final ProductRepository productRepository;
    private final InvoiceMapper invoiceMapper;
    private final SupplierRepository supplierRepository;
    private final ProductMapper productMapper;

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
            // Thông báo ngoại lệ nếu sản phẩm không thuộc về nh cung cấp
            if (!product.getSupplier().getId().equals(supplier.getId())) {
                throw new BadRequestUserException("Sản phẩm không thuộc về nhà cung cấp");
            }
            ShipmentItem shipmentItem = ShipmentItem.builder()
                    .product(product)
                    .quantity(productItem.quantity())
                    .exp(productItem.exp())
                    .mxp(productItem.mxp())
                    .shipment(shipmentSave)
                    .build();
            List<Object[]> productPrices = productPriceRepository.getProductPriceLatest(
                    productItem.id(), PageRequest.of(0, 1));
            Object[] productPrice = null;
            // Tạo mới mới product price nếu không có product price
            if(productPrices.isEmpty()){
                productPrice = new Object[]{productItem.price(),productItem.price() + productItem.price() * DEFAULT_PROFIT,0};
                ProductPrice newProductPrice = ProductPrice.builder()
                        .product(Product.builder().id(productItem.id()).build())
                        .originalPrice(productItem.price())
                        .price(productItem.price())
                        .discountPrice(0)
                        .createdAt(new Date())
                        .build();
                productPriceRepository.save(newProductPrice);
            }else{
                productPrice = productPrices.get(0);
            }
            double oldPrice = productPriceMapper.mapObjectToProductPriceResponse(productPrice).originalPrice();
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
            shipmentItemRepository.save(shipmentItem);
            // Cập nhật số lượng sản phẩm
            Stock stock = stockRepository.findStockByProductId(productItem.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lô hàng của sản phẩm"));
            stock.setQuantity(stock.getQuantity() + productItem.quantity());
            stockRepository.save(stock);
            total = total.add(BigDecimal.valueOf(productItem.quantity()).multiply(BigDecimal.valueOf(productItem.price())));
        }
        return new ShipmentResponse(supplier.getName(),
                total,
                shipmentRequest.productItems(),
                shipmentSave.getCreatedAt());
    }

    @Override
    public PageResponse<ImportInvoice> getImportInvoices(Integer pageNumber, Integer pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);
        var shipments = shipmentRepository.getShipments(pageRequest);
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
