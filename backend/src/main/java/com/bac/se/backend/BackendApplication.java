package com.bac.se.backend;

import com.bac.se.backend.services.ShipmentService;
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
    ShipmentService shipmentService;

//    @Bean
//    CommandLineRunner commandLineRunner(){
//        return args -> {
//            var desc = shipmentService.getShipments(0, 10, "", "shipment_id", "DESC", "20");
//            for (var productShipmentResponse : desc.getResponseList()) {
//                log.info(productShipmentResponse.toString());
//            }
//        };
//    }






}
