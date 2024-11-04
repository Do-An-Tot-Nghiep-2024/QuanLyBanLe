package com.bac.se.backend.services.impl;

import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.models.ProductPrice;
import com.bac.se.backend.payload.response.product.ProductPriceResponse;
import com.bac.se.backend.repositories.ProductPriceRepository;
import com.bac.se.backend.services.ProductPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductPriceServiceImpl implements ProductPriceService {
    private final ProductPriceRepository productPriceRepository;
    private final ProductPriceMapper productPriceMapper;

    @Override
    public ProductPriceResponse getPriceLatest(Long productId) {
            var productPriceLatest = productPriceRepository.getProductPriceLatest(productId, PageRequest.of(0, 1));
            if (productPriceLatest.isEmpty()) {
                return new ProductPriceResponse(0L, 0, 0, 0);
            }
            return productPriceMapper.mapObjectToProductPriceResponse(productPriceLatest.get(0));
        }

    @Override
    public ProductPrice createProductPrice(ProductPrice productPrice) {
       return productPriceRepository.save(productPrice);
    }

    @Override
    public ProductPrice getProductPriceById(Long productPriceId) {
        return productPriceRepository.findById(productPriceId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giá mới nhất của sản phẩm"));
    }

}
