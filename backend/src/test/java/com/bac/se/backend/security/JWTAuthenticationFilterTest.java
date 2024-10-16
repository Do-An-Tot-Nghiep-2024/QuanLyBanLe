package com.bac.se.backend.security;

import com.bac.se.backend.utils.JwtParse;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.IOException;

import static org.mockito.Mockito.*;

class JWTAuthenticationFilterTest {

    @Mock
    private JWTService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private JwtParse jwtParse;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private ServletOutputStream outputStream;

    @Mock
    private FilterChain filterChain;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private JWTAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);
        when(response.getOutputStream()).thenReturn(outputStream);
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldProceedWithoutAuthenticationIfAuthEndpoint() throws Exception {
        when(request.getServletPath()).thenReturn("/api/v1/auth");

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
        verifyNoInteractions(jwtService, userDetailsService);
    }

    @Test
    void shouldSetAuthenticationIfValidTokenProvided() throws Exception {
        String token = "validToken";
        String username = "testUser";

        when(request.getServletPath()).thenReturn("/api/v1/other");
        when(jwtParse.parseJwt(request)).thenReturn(token);
        when(jwtService.extractUsername(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(userDetails.getAuthorities()).thenReturn(null);

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        verify(jwtParse, times(1)).parseJwt(request);
        verify(jwtService, times(1)).extractUsername(token);
        verify(userDetailsService, times(1)).loadUserByUsername(username);
        verify(filterChain, times(1)).doFilter(request, response);
        assert authentication != null;
        assert authentication.getPrincipal().equals(userDetails);
    }

    @Test
    void shouldReturnUnauthorizedIfJwtExceptionThrown() throws Exception {
        when(request.getServletPath()).thenReturn("/api/v1/other");
        when(jwtParse.parseJwt(request)).thenThrow(new JwtException("Invalid token"));

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(response, times(1)).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        verify(response.getOutputStream(), times(1)).println("{ \"message\": \"Invalid or expired token, you may login and try again! \" }");
        verify(filterChain, never()).doFilter(request, response);
    }

    @Test
    void shouldReturnInternalServerErrorIfOtherExceptionThrown() throws Exception {
        when(request.getServletPath()).thenReturn("/api/v1/other");
        when(jwtParse.parseJwt(request)).thenThrow(new RuntimeException("Some other error"));

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(response, times(1)).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        verify(response.getOutputStream(), times(1)).println("{ \"message\": \"Some other error\" }");
        verify(filterChain, never()).doFilter(request, response);
    }
}