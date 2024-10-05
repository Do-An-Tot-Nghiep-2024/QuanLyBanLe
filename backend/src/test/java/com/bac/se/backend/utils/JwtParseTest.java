package com.bac.se.backend.utils;

import com.bac.se.backend.security.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class JwtParseTest {


    @InjectMocks
    private JwtParse jwtParse;
    @Mock
    private JWTService jwtService;
    @Mock
    private HttpServletRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

    }

    @Test
    void parseJwt() {
        String token = "testToken";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        String result = jwtParse.parseJwt(request);
        assertEquals(result, token);

    }

    @Test
    void parseJwtFail() {
        String token = "";
        when(request.getHeader("Authorization")).thenReturn(token);
        String result = jwtParse.parseJwt(request);
        assertEquals(null, result);
    }

    @Test
    void decodeTokenWithRequest() {
        String token = "testToken";
        String username = "testUser";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.extractUsername(token)).thenReturn(username);
        String result = jwtParse.decodeTokenWithRequest(request);
        assertEquals(result, username);

    }
}