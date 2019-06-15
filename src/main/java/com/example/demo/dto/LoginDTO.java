package com.example.demo.dto;

import com.example.demo.entity.Student;
import com.example.demo.entity.Users;

import java.io.Serializable;

public class LoginDTO implements Serializable {

    private String token;
    private Users users;
    private Student student;

    public LoginDTO() {
    }

    public LoginDTO(String token, Users users) {
        this.token = token;
        this.users = users;
    }

    public LoginDTO(String token, Users users, Student student) {
        this.token = token;
        this.users = users;
        this.student = student;
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

    public void setUsers(Users users) {
        this.users = users;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
