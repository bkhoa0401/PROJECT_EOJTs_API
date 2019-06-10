package com.example.demo.controller;

import com.example.demo.entity.Users;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UsersService userService;

//    @PostMapping
//    public ResponseEntity<Void> addListStudent(@RequestBody List<Users> userList) throws Exception {
//        try {
//            userService.saveListUser(userList);
//        } catch (PersistenceException ex) {
//            ex.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.CONFLICT);
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//        return new ResponseEntity<>(HttpStatus.CREATED);
//    }


    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() throws Exception {
        List<Users> userList = new ArrayList<>();
        try {
            userList = userService.getAllUsers();

        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }
}
