package com.bac.se.backend.services;

import com.bac.se.backend.repositories.ProductPriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductPriceService {
    private final ProductPriceRepository productPriceRepository;

//    public ProductPriceResponse getPriceLatest(Long id) {
//        var productPriceLatest = productPriceRepository.getProductPriceLatest(id, PageRequest.of(0, 1));
//        return new ProductPriceResponse(
//                Double.parseDouble(productPriceLatest[0].toString()),
//                Double.parseDouble(productPriceLatest[1].toString()),
//                Double.parseDouble(productPriceLatest[2].toString())
//        );
//    }
}
