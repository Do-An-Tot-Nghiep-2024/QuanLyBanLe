package com.bac.se.backend;

import com.bac.se.backend.repositories.StockRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.PageRequest;

import java.util.List;


@SpringBootApplication
@Slf4j
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        log.info("Program is running");
    }

    @Autowired
    StockRepository stockRepository;

    @Bean
    CommandLineRunner commandLineRunner(){
        return args -> {
            List<Object[]> list = stockRepository.getAvailableQuantityStock(7L,2L, PageRequest.of(0, 1));
           log.info("Size of list is {}",list.size());
        };
    }
}
