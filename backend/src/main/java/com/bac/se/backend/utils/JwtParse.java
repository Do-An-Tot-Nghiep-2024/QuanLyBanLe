package com.bac.se.backend.utils;

import com.bac.se.backend.security.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class JwtParse {
    private final JWTService jwtService;
    public String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }

    public String decodeTokenWithRequest(HttpServletRequest request){
        String tokenAuth = parseJwt(request);
        return jwtService.extractUsername(tokenAuth);
    }
}
