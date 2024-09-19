package com.bac.se.backend.exceptions;

import org.apache.coyote.BadRequestException;

public class BadRequestUserException extends BadRequestException {
    public BadRequestUserException(String message) {
        super(message);
    }
}
