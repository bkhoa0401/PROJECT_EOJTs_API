package com.example.demo.service;

import com.example.demo.entity.*;

import java.util.List;

public interface IUsersService {

    void sendEmail(String name, String mail, String password) throws Exception;

    void sendResetEmail(String token, String email) throws Exception;

    void sendEmailHeading(String mail, String content) throws Exception;

    String getAlphaNumericString();

    Users findUserByEmail(String email);

    Users findUserByEmailAndPassWord(String email, String password);

    boolean saveListUser(List<Users> usersList);

    boolean saveUser(Users users);

    List<Users> getAllUsers();

    boolean updatePasswordOfUserByEmail(String email, String password);

    boolean updateStatus(String email, boolean isActive);

    boolean createResetToken(String email);

    boolean checkToken(String token, String email);

    boolean createNewPassword(String password, String email);

    List<Users> getAllUsersByType(int type);

    List<Users> getAllUsersBySemester();
}
