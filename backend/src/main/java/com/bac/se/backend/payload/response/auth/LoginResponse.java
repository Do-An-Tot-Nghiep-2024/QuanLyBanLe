package com.bac.se.backend.payload.response.auth;

public record LoginResponse(String accessToken, String refreshToken) {
}
