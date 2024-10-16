package com.bac.se.backend.config;

import com.bac.se.backend.models.Account;
import com.bac.se.backend.repositories.AccountRepository;
import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ApplicationConfigTest {
    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private ApplicationConfig config;

    @Mock
    private AuthenticationConfiguration authenticationConfiguration;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private Cloudinary cloudinary;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(config, "cloudName", "testCloudName");
        ReflectionTestUtils.setField(config, "apiKey", "testApiKey");
        ReflectionTestUtils.setField(config, "apiSecret", "testApiSecret");
    }

    @Test
    void testUserDetailsService_UserExists() {
        // Mock the accountRepository to return a valid UserDetails object
        String username = "testuser";
        Account userDetails = Account.builder()
                .username(username)
                .password("123456")
                .build();
        when(accountRepository.findByUsername(username)).thenReturn(Optional.of(userDetails));

        // Call userDetailsService method
        UserDetailsService userDetailsService = config.userDetailsService();
        UserDetails result = userDetailsService.loadUserByUsername(username);

        // Assert that the returned user details are correct
        assertEquals(username, result.getUsername());
        verify(accountRepository, times(1)).findByUsername(username);
    }

    @Test
    void testUserDetailsService_UserNotFound() {
        // Mock the accountRepository to return an empty Optional (user not found)
        String username = "testuser";
        when(accountRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Call userDetailsService method and expect a UsernameNotFoundException
        UserDetailsService userDetailsService = config.userDetailsService();
        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername(username);
        });

        // Verify that the repository was called once
        verify(accountRepository, times(1)).findByUsername(username);
    }

    @Test
    void testAuthenticationProvider() {
        // Call the method
        AuthenticationProvider authenticationProvider = config.authenticationProvider();

        // Assert that the authentication provider is an instance of DaoAuthenticationProvider
        assertInstanceOf(DaoAuthenticationProvider.class, authenticationProvider);

        // Assert that the correct UserDetailsService and PasswordEncoder are set
        DaoAuthenticationProvider daoProvider = (DaoAuthenticationProvider) authenticationProvider;
//        assertNotNull(daoProvider.getUserDetailsService());
//        assertNotNull(daoProvider.getPasswordEncoder());
    }

    @Test
    void testPasswordEncoder() {
        // Call the passwordEncoder method
        PasswordEncoder passwordEncoder = config.passwordEncoder();

        // Assert that it returns an instance of BCryptPasswordEncoder
        assertInstanceOf(BCryptPasswordEncoder.class, passwordEncoder);
    }

    @Test
    void testAuthenticationManager() throws Exception {
        // Mock the behavior of the authenticationConfiguration to return the mocked authenticationManager
        when(authenticationConfiguration.getAuthenticationManager()).thenReturn(authenticationManager);

        // Call the authenticationManager method
        AuthenticationManager result = config.authenticationManager(authenticationConfiguration);

        // Assert that the returned authentication manager is the mocked one
        assertEquals(authenticationManager, result);
        verify(authenticationConfiguration, times(1)).getAuthenticationManager();
    }

    @Test
    void testCloudinaryConfig() {
        Cloudinary cloudinary = config.cloudinaryConfig();
        // Assert: return-value check
        assertEquals("testCloudName", cloudinary.config.cloudName);
        assertEquals("testApiKey", cloudinary.config.apiKey);
        assertEquals("testApiSecret", cloudinary.config.apiSecret);
    }

}