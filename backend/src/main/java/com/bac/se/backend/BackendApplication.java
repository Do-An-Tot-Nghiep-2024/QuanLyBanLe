package com.bac.se.backend;

import com.bac.se.backend.utils.DateConvert;
import lombok.extern.slf4j.Slf4j;
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


    DateConvert dateConvert = new DateConvert();

    @Bean
    CommandLineRunner commandLineRunner(){
        return args -> {
            var res = dateConvert.generateDayInCurrentWeek(-7);
            log.info("res {}",res);
        };
    }



}
