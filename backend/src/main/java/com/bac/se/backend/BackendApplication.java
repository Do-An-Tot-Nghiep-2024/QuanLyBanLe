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
//    CommandLineRunner commandLineRunner() {
//       return (args) -> {
//           var notificationsByStatus = notificationRepository.getNotificationsByStatus(NotificationStatus.SENT);
//           for (var notification : notificationsByStatus) {
//               log.info("Notification id {} content {} status {}", notification.getId(), notification.getContent(), notification.getStatus());
//           }
//       };
//    }

}
