package com.example.dto;

import com.example.demo.entity.Account;

public class Login {

    private String token;
    private Account account;

    public Login() {
    }

    public Login(String token, Account account) {

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
