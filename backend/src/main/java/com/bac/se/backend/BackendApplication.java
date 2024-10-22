package com.bac.se.backend;

import com.bac.se.backend.repositories.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
@Slf4j
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        log.info("Program is running");
    }


    @Autowired
    ProductRepository productRepository;

    @Bean
    CommandLineRunner commandLineRunner(){
        return args -> {
           List<Object[]> productList = productRepository.getProductsBySupplier(1L);
           productList.forEach(x -> {
               log.info(x[0].toString());
               log.info(x[1].toString());
           });
        };
    }

}
