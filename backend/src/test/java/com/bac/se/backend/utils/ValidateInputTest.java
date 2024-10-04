package com.bac.se.backend.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ValidateInputTest {

    private final ValidateInput validateInput = new ValidateInput();

    @Test
    void isValidEmailSuccess() {
        assertTrue(validateInput.isValidEmail("john@gmail.com"));
    }
    @Test
    void isValidEmailFail() {
        assertFalse(validateInput.isValidEmail("bac.segmail.com"));
    }

    @Test
    void isValidPhoneNumberSuccess() {
        assertTrue(validateInput.isValidPhoneNumber("0123456789"));
    }

    @Test
    void isValidPhoneNumberFail() {
        assertFalse(validateInput.isValidPhoneNumber("01234567890"));
    }

}