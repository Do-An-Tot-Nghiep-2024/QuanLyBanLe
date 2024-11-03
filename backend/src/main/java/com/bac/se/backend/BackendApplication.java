package com.bac.se.backend;

import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.payload.response.product.ProductMobileResponse;
import com.bac.se.backend.repositories.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;


@SpringBootApplication
@Slf4j
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        log.info("Program is running");
    }

    @Autowired
    ProductRepository  productRepository;

    private final ProductMapper productMapper = new ProductMapper();

    @Bean
    CommandLineRunner commandLineRunner(){
        return args -> {
            Pageable request = PageRequest.of(0, 10);
            Page<Object[]> res = productRepository.getProductsMobile(1L,request);
            List<ProductMobileResponse> list = res.getContent().stream().map(productMapper::mapObjectToProductMobileResponse).toList();
            for (ProductMobileResponse productMobileResponse : list) {
               log.info("Product mobile response is {}",productMobileResponse);
            }
        };
    }
}
