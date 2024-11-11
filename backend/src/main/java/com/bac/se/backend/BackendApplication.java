package com.bac.se.backend;

import com.bac.se.backend.mapper.ShipmentMapper;
import com.bac.se.backend.repositories.ShipmentItemRepository;
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
    ShipmentItemRepository shipmentItemRepository;

    ShipmentMapper shipmentMapper = new ShipmentMapper();






}
