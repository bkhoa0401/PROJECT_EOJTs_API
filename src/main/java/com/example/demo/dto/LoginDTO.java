package com.example.demo.dto;

import com.example.demo.entity.Account;

import java.io.Serializable;

public class LoginDTO implements Serializable {

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
