package com.example.demo.dto;

import com.example.demo.entity.Account;

public class LoginDTO {

    private String token;
    private Account account;

    public LoginDTO() {
    }

    public LoginDTO(String token, Account account) {

        this.token = token;
        this.account = account;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }
}
