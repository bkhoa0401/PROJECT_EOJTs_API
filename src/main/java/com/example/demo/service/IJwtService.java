package com.example.demo.service;

import com.nimbusds.jwt.JWTClaimsSet;
import java.util.Date;

public interface IJwtService {

    public String generateTokenLogin(String email, String role);

    JWTClaimsSet getClaimsFromToken(String token);

    Date generateExpirationDate();

    Date getExpirationDateFromToken(String token);

    public String getEmailFromToken(String token);

    byte[] generateShareSecret();

    Boolean isTokenExpired(String token);

    Boolean validateTokenLogin(String token);
}
