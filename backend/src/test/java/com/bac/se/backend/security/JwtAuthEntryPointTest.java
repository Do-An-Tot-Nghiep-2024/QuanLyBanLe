package com.bac.se.backend.security;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;

import static org.mockito.Mockito.*;

class JwtAuthEntryPointTest {


    private JwtAuthEntryPoint jwtAuthEntryPoint;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtAuthEntryPoint = new JwtAuthEntryPoint();
    }
    @AfterEach
    void clearUp(){
        jwtAuthEntryPoint = null;
    }

    @Test
    void commence() throws IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        AuthenticationException authException = mock(AuthenticationException.class);
        // Mock the ServletOutputStream
        ServletOutputStream outputStream = mock(ServletOutputStream.class);
        when(response.getOutputStream()).thenReturn(outputStream);
        jwtAuthEntryPoint.commence(request, response, authException);
        verify(response).setContentType("application/json");
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        verify(outputStream).println("{ \"error\": \"Username or password is incorrect\" }");
    }
}