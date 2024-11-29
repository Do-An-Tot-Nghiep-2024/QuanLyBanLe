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


//    @Autowired
//    NotificationRepository notificationRepository;
//
//    @Bean
//    CommandLineRunner commandLineRunner(){
//        return args -> {
//            Notification notification = Notification.builder()
//                    .content("New notification")
//                    .status(NotificationStatus.SENT)
//                    .sentAt(new Date())
//                    .build();
//            notificationRepository.save(notification);
//        };
//    }

}
