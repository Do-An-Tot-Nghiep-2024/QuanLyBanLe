package com.bac.se.backend;

import com.bac.se.backend.repositories.PromotionRepository;
import com.bac.se.backend.services.ProductPriceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


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
    ProductPriceService productPriceService;


//    @Bean
//    CommandLineRunner commandLineRunner(){
//        return args -> {
//            Set<Long> set = new HashSet<>();
//            set.add(2L);
//
//// Create a map with the ID from the set as the key and ProductPriceResponse as the value
//            Map<Long, ProductPriceResponse> productPriceResponseMap = set
//                    .stream()
//                    .collect(Collectors.toMap(
//                            Function.identity(), // The key is the value from the set (the Long ID)
//                            id -> productPriceService.getPriceLatest(id) // The value is the ProductPriceResponse
//                    ));
//
//// Log the key-value pairs
//            for (Long key : productPriceResponseMap.keySet()) {
//                log.info("key {} value {}", key, productPriceResponseMap.get(key));
//            }
//        };
//    }


}
