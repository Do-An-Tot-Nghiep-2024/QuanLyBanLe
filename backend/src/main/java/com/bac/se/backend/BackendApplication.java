package com.bac.se.backend;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        log.info("Program is running");
    }
//
//    @Autowired
//    OrderRepository orderRepository;
////    OrderMapper orderMapper = new OrderMapper();
//
//    @Autowired
//    EmployeeRepository employeeRepository;
//
//    @Bean
//    CommandLineRunner commandLineRunner(){
//        return args -> {
//            var orderItemByOrderId = orderRepository.getOrderItemByOrderId(4L);
//            for (var orderItem : orderItemByOrderId) {
//                log.info("Order Item: {}", orderItem);
//            }
//        };
//    }


}
