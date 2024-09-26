package com.bac.se.backend.payload.request;


public record EmployeeAccountRequest(
        String email,
        String password,
        String confirmPassword
        ) {
}
