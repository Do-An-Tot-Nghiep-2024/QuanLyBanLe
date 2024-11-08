package com.bac.se.backend;

import com.bac.se.backend.payload.response.promotion.PromotionResponse;
import com.bac.se.backend.repositories.PromotionRepository;
import com.bac.se.backend.services.PromotionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
@Slf4j
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        log.info("Program is running");
    }

    @Autowired
    PromotionRepository promotionRepository;

    @Autowired
    PromotionService promotionService;

    @Bean
    CommandLineRunner commandLineRunner(){
        return args -> {
            var promotions = promotionService.getPromotions(0, 10);
            for (PromotionResponse promotionResponse : promotions.getResponseList()) {
                log.info("promotionResponse {}", promotionResponse);
            }
        };
    }




}
