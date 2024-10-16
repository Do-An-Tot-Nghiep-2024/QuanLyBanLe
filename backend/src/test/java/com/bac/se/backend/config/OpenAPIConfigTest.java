package com.bac.se.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class OpenAPIConfigTest {
    @Test
    public void testOpenapiDefinitionApplied() {
        OpenAPIDefinition openAPIDefinition = OpenAPIConfig.class.getAnnotation(OpenAPIDefinition.class);
        assertNotNull(openAPIDefinition);
        assertEquals("OpenApi specification - Viet Bac", openAPIDefinition.info().title());
        assertEquals("1.0", openAPIDefinition.info().version());
    }

}