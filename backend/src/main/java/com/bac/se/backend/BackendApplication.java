package com.bac.se.backend;

import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.repositories.OrderItemRepository;
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
    OrderItemRepository orderItemRepository;

    ProductMapper productMapper = new ProductMapper();

//    @Bean
//    CommandLineRunner commandLineRunner(){
//        return args -> {
//            var productInOrderItem = orderItemRepository.getProductInOrderItem(119L);
//            if(productInOrderItem.isEmpty()){
//                log.info("Không tìm thấy sản phẩm trong hóa đơn");
//            }
//            productInOrderItem.stream().map(productMapper::mapToProductOrderItemResponse).forEach(System.out::println);
//        };
//    }






}
