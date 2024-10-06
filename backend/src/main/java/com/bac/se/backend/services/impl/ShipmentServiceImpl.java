package com.bac.se.backend.services.impl;

import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.ShipmentRequest;
import com.bac.se.backend.payload.response.ShipmentResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.ShipmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

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

    ///  create order shipment

    @Override
    public ShipmentResponse createShipment(ShipmentRequest shipmentRequest){
        Shipment shipment = Shipment.builder()
                .createdAt(new Date())
                .build();
        // save shipment
        var shipmentSave = shipmentRepository.save(shipment);
        BigDecimal total = BigDecimal.ZERO;
        for (var productItem : shipmentRequest.productItems()) {
            Product product = productRepository.findById(productItem.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
            ShipmentItem shipmentItem = ShipmentItem.builder()
                    .product(product)
                    .quantity(productItem.quantity())
                    .expirationDate(productItem.expirationDate())
                    .productionDate(productItem.productionDate())
                    .shipment(shipmentSave)
                    .build();
            Object[] productPrice = productPriceRepository.getProductPriceLatest(productItem.id(), PageRequest.of(0, 1)).get(0);
            double oldPrice = productPriceMapper.mapObjectToProductPriceResponse(productPrice).price();
            // compare price with old price
            if(oldPrice != productItem.price()) {
                ProductPrice newProductPrice = ProductPrice.builder()
                        .product(Product.builder().id(productItem.id()).build())
                        .originalPrice(productItem.price())
                        .price(productItem.price() + productItem.price() * DEFAULT_PROFIT)
                        .discountPrice(0)
                        .createdAt(new Date())
                        .build();
                productPriceRepository.save(newProductPrice);

            }
            // save shipment item
            shipmentItemRepository.save(shipmentItem);
            // update quantity product in stock
            Stock stock = stockRepository.findStockByProductId(productItem.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lô hàng của sản phẩm"));
            stock.setQuantity(stock.getQuantity() + productItem.quantity());
            stockRepository.save(stock);
            total = total.add(BigDecimal.valueOf(productItem.quantity()).multiply(BigDecimal.valueOf(productItem.price())));
        }
        return new ShipmentResponse(shipmentRequest.name(),
                total,
                shipmentRequest.productItems(),
                shipmentSave.getCreatedAt());
    }
}
