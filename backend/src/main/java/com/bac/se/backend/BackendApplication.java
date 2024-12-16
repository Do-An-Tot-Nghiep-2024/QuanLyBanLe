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
            var response = dateConvert.generateDayInCurrentWeek(0);
            log.info("response date {}",response);
            var responseMap = dateConvert.generateDateInWeekMap(0);
            for(String key : responseMap.keySet()){
                log.info("key {}",key);
                log.info("value {}",responseMap.get(key));
            }
        };
    }



}
