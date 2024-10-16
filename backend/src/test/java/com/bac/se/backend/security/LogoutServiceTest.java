package com.bac.se.backend.security;

import com.bac.se.backend.models.Account;
import com.bac.se.backend.repositories.AccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

class LogoutServiceTest {

    @Test
    void logoutSuccess() {
        // Handles valid JWT in Authorization header correctly
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        Authentication authentication = mock(Authentication.class);
        AccountRepository accountRepository = mock(AccountRepository.class);
        LogoutService logoutService = new LogoutService(accountRepository);

        String jwt = "validJwtToken";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(accountRepository.findByUsername(jwt)).thenReturn(Optional.of(new Account()));

        logoutService.logout(request, response, authentication);

        verify(accountRepository).findByUsername(jwt);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void logoutWithHeaderNull() {
        // Handles null Authorization header gracefully
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        Authentication authentication = mock(Authentication.class);
        AccountRepository accountRepository = mock(AccountRepository.class);
        LogoutService logoutService = new LogoutService(accountRepository);

        when(request.getHeader("Authorization")).thenReturn(null);

        logoutService.logout(request, response, authentication);

        verify(accountRepository, never()).findByUsername(anyString());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}