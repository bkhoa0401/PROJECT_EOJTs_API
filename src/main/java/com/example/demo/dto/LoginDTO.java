package com.example.demo.dto;

import com.example.demo.entity.Users;

import java.io.Serializable;

public class LoginDTO implements Serializable {

    private String token;
    private Users users;

    public LoginDTO() {
    }

    public LoginDTO(String token, Users users) {

        this.token = token;
        this.users = users;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Users getUsers() {
        return users;
    }

    public void setUser(Users users) {
        this.users = users;
    }
}
