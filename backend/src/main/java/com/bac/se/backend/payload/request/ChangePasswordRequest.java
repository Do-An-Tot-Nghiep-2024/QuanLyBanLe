package com.bac.se.backend.payload.request;

public record ChangePasswordRequest(
        String password,
        String newPassword,
        String confirmPassword
) {
}
