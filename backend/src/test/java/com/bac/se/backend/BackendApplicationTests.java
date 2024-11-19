package com.bac.se.backend;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ContextConfiguration;

@ContextConfiguration(classes = {BackendApplication.class})
class BackendApplicationTests {

    @Test
    public void Main_StartsSpringApplication_Successfully() {
        String[] args = new String[]{};
        BackendApplication.main(args);
    }
}


