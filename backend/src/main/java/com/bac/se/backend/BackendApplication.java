package com.bac.se.backend;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;


@SpringBootApplication
@Slf4j
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        log.info("Program is running");
    }

    @Autowired
    PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner commandLineRunner(){
        return args -> {
            String pass = "$2a$10$B8Xl7lX4B1lMf57.AUg66ubI7AhaSO1dXUdMcSXZmC5C8zlcAr9da";
            log.info("Password is {}",passwordEncoder.matches("123457",pass));
        };
    }

}
