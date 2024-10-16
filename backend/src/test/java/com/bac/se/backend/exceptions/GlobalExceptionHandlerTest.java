package com.bac.se.backend.exceptions;

import com.bac.se.backend.payload.response.common.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class GlobalExceptionHandlerTest {

    @Test
    void handleAccessDeniedException() {
        // Handle AccessDeniedException and return 403 Forbidden with appropriate message
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        AccessDeniedException ex = new AccessDeniedException("Access is denied");
        ResponseEntity<ApiResponse<String>> response = handler.handleAccessDeniedException(ex);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("You do not have permission to this action", response.getBody().getMessage());
        assertEquals("access denied", response.getBody().getData());
    }

    @Test
    void handleHttpMessageNotReadable() {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        HttpMessageNotReadableException ex = new HttpMessageNotReadableException("Required request body is missing or invalid");
        ResponseEntity<ApiResponse<String>> response = handler.handleHttpMessageNotReadable(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Required request body is missing or invalid", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }
}