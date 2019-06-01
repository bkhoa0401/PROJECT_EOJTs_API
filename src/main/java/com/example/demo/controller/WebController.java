package com.example.demo.controller;

import com.example.demo.entity.Account;
import com.example.demo.entity.Login;
import com.example.demo.service.AccountService;
import com.example.demo.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@CrossOrigin
@RestController
@RequestMapping("/api/account")
public class WebController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public String addListStudent(@RequestBody List<Account> account) throws Exception {
        accountService.addListStudent(account);
//        for (int i = 0; i < account.size(); i++) {
//            accountService.sendEmail(account.get(i).getName(), account.get(i).getEmail());
//        }
        return "success";
    }

//    @PostMapping("/android/login")
//    public Account getAccountAndroidByEmailAndPassword(@RequestBody Login login) {
//        return accountService.findAccountStudentByEmailAndPassword(login.getEmail(), login.getPassword(), "student");
//    }
//
//    @PostMapping("/web/login")
//    public Account getAccountWebByEmailAndPassword(@RequestBody Login login) {
//        Account account = accountService.findAccountStudentByEmailAndPassword(login.getEmail(), login.getPassword(), "admin");
//        if (account == null) {
//            return accountService.findAccountStudentByEmailAndPassword(login.getEmail(), login.getPassword(), "hr");
//        }
//        return account;
//    }
    @PostMapping("/login")
    public ResponseEntity<Login> checkLogin(HttpServletRequest request, @RequestBody Account account, HttpServletResponse response) {
        String result = "";
        HttpStatus httpStatus = null;
        boolean check;
        Account accountFound = new Account();
        Login login = new Login();
        try {
            check = false;
            if (accountService.findAccountStudentByEmailAndPassword(account.getEmail(), account.getPassword(), "ROLE_STUDENT") != null) {
                accountFound = accountService.findAccountStudentByEmailAndPassword(account.getEmail(), account.getPassword(), "ROLE_STUDENT");
                result = jwtService.generateTokenLogin(accountFound.getEmail(), "ROLE_STUDENT");
                check = true;
//                Cookie cookie = new Cookie("id_token", result);
//                cookie.setMaxAge(7 * 24 * 60 * 60); // expires in 7 days
//                cookie.setSecure(true);
//                cookie.setHttpOnly(true);
//                cookie.setPath("/");
//                response.addCookie(cookie);
            } else if (accountService.findAccountStudentByEmailAndPassword(account.getEmail(), account.getPassword(), "ROLE_HR") != null) {
                accountFound = accountService.findAccountStudentByEmailAndPassword(account.getEmail(), account.getPassword(), "ROLE_HR");
                result = jwtService.generateTokenLogin(accountFound.getEmail(), "ROLE_HR");
                check = true;
            } else if (accountService.findAccountStudentByEmailAndPassword(account.getEmail(), account.getPassword(), "ROLE_ADMIN") != null) {
                accountFound = accountService.findAccountStudentByEmailAndPassword(account.getEmail(), account.getPassword(), "ROLE_ADMIN");
                result = jwtService.generateTokenLogin(accountFound.getEmail(), "ROLE_ADMIN");
                check = true;
            }

            if (check) {
                login.setAccount(accountFound);
                login.setToken(result);
                httpStatus = HttpStatus.OK;
            } else {
                result = "Invalid Email or Password!";
                login.setToken(result);
                httpStatus = HttpStatus.BAD_REQUEST;
            }
        } catch (Exception ex) {
            result = "Server Error";
            login.setToken(result);
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Login>(login, HttpStatus.OK);
    }
}
