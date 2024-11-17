package com.bac.se.backend;

import com.bac.se.backend.payload.response.order.StockOrderResponse;
import com.bac.se.backend.repositories.OrderItemRepository;
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
    OrderItemRepository orderItemRepository;

    @Bean
    CommandLineRunner commandLineRunner(){
        return args -> {
            List<Object[]> stocks = orderItemRepository.getStockByOrder(139L);
            List<StockOrderResponse> stockOrderResponses = stocks.stream().map(stock ->
                    new StockOrderResponse(Long.parseLong(stock[0].toString()),
                            Integer.parseInt(stock[1].toString()))).toList();
            for (StockOrderResponse stockOrderResponse : stockOrderResponses) {
                log.info("stockOrderResponse {}", stockOrderResponse);
            }

        };
    }






}
