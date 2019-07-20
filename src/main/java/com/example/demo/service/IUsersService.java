package com.example.demo.service;

import com.example.demo.entity.*;

import java.util.List;

public interface IUsersService {

    void sendEmail(String name, String mail, String password) throws Exception;

    String getAlphaNumericString();

    Users findUserByEmail(String email);

    Users findUserByEmailAndPassWord(String email, String password);

    boolean saveListUser(List<Users> usersList);

    boolean saveUser(Users users);

    List<Users> getAllUsers();

    boolean updatePasswordOfUserByEmail(String email, String password);

    boolean updateStatus(String email, boolean isActive);

    List<Users> getAllUsersByType(int type);

    List<Users> getAllUsersBySemester();
}