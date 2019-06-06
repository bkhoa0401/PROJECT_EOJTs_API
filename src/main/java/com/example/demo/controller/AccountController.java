package com.example.demo.controller;

import com.example.demo.dto.AccountDTO;
import com.example.demo.entity.Account;
import com.example.demo.dto.LoginDTO;
import com.example.demo.service.AccountService;
import com.example.demo.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import javax.persistence.PersistenceException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<Void> addListStudent(@RequestBody List<Account> listAccounts) throws Exception {

        try {
            accountService.addListStudent(listAccounts);

//        for (int i = 0; i < account.size(); i++) {
//            accountService.sendEmail(account.get(i).getName(), account.get(i).getEmail());
//        }

        } catch (PersistenceException ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/token")
    public ResponseEntity<LoginDTO> checkLogin(HttpServletRequest request, @RequestBody Account account, HttpServletResponse response) {
        String result = "";
        HttpStatus httpStatus = null;
        boolean check;
        Account accountFound = new Account();
        LoginDTO login = new LoginDTO();
        try {
            check = false;
            if (accountService.findAccountStudentByEmailAndPassword(account.getEmail(), account.getPassword()) != null) {
                accountFound = accountService.findAccountStudentByEmailAndPassword(account.getEmail(), account.getPassword());
                result = jwtService.generateTokenLogin(accountFound.getEmail());

                login.setAccount(accountFound);
                login.setToken(result);
                httpStatus = HttpStatus.OK;
            } else {
                httpStatus = HttpStatus.BAD_REQUEST;
            }
        } catch (Exception ex) {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<LoginDTO>(login, httpStatus);
    }

    @GetMapping
    public ResponseEntity<Account> getOneAccount() {

        Account account = new Account();
        account = accountService.getListStudent();

        return new ResponseEntity<Account>(account, HttpStatus.OK);
    }
}
