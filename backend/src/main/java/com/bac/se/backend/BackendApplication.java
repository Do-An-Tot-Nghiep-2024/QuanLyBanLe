package com.bac.se.backend;

import com.bac.se.backend.keys.ShipmentItemKey;
import com.bac.se.backend.models.Product;
import com.bac.se.backend.models.Shipment;
import com.bac.se.backend.models.ShipmentItem;
import com.bac.se.backend.repositories.ShipmentItemRepository;
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
    ShipmentItemRepository shipmentItemRepository;

    @Bean
    CommandLineRunner commandLineRunner(){
        return args -> {
            ShipmentItem shipmentItem = shipmentItemRepository.findById(ShipmentItemKey.builder()
                            .product(Product.builder().id(2L).build())
                            .shipment(Shipment.builder().id(3L).build())
                            .build())
                    .orElseThrow(() -> new RuntimeException("Not found"));
            System.out.println(shipmentItem.getExpirationDate());
        };
    }


}
