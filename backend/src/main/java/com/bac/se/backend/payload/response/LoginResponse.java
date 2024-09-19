package com.bac.se.backend.payload.response;

public record LoginResponse(String accessToken, String refreshToken) {
}
