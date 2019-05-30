package com.example.demo.controller;

import com.example.demo.entity.Account;
import com.example.demo.entity.Login;
import com.example.demo.entity.Role;
import com.example.demo.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin
@RestController
public class WebController {
    @Autowired
    AccountService accountService;

    @PostMapping("/")
    public String addListStudent(@RequestBody List<Account> account) throws Exception {
        accountService.addListStudent(account);
        for (int i = 0; i < account.size(); i++) {
            accountService.sendEmail(account.get(i).getName(), account.get(i).getEmail());
        }
        return "success";
    }

    @PostMapping("/android/login")
    public Account getAccountAndroidByEmailAndPassword(@RequestBody Login login) {
        return accountService.findAccountStudentByEmailAndPassword(login.getEmail(), login.getPassword(), "student");
    }

    @PostMapping("/web/login")
    public Account getAccountWebByEmailAndPassword(@RequestBody Login login) {
        Account account = accountService.findAccountStudentByEmailAndPassword(login.getEmail(), login.getPassword(), "admin");
        if (account == null) {
            return accountService.findAccountStudentByEmailAndPassword(login.getEmail(), login.getPassword(), "hr");
        }
        return account;
    }

}
