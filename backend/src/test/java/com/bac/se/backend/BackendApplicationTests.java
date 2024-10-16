package com.bac.se.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class BackendApplicationTests {

    @Test
    public void Main_StartsSpringApplication_Successfully() {
        String[] args = new String[]{};
        BackendApplication.main(args);
    }

}
