package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.Ojt_EnrollmentService;
import com.example.demo.service.SemesterService;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PersistenceException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UsersService userService;

    @Autowired
    SemesterService semesterService;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

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
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> userList;
        try {
            userList = userService.getAllUsers();

        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @GetMapping("/usersBySemester")
    public ResponseEntity<List<Users>> getAllUsersBySemester() {
        List<Users> usersListCurrentSemester = userService.getAllUsersBySemester();
        if (usersListCurrentSemester != null) {
            return new ResponseEntity<List<Users>>(usersListCurrentSemester, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //update pass word of user
    @PutMapping("/updatePassword")
    public ResponseEntity<Void> updatePassWordOfUsers(@RequestParam String password) {
        String email = getEmailFromToken();
        boolean updatePassword = userService.updatePasswordOfUserByEmail(email, password);
        if (updatePassword == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<Void> updateActive(@RequestParam String email, @RequestParam boolean isActive) {
        boolean update = userService.updateStatus(email, isActive);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get all users by type
    @GetMapping("/getUsersByType")
    @ResponseBody
    public ResponseEntity<List<Users>> getUsersByType(@RequestParam int type) {
        List<Users> usersList = userService.getAllUsersByType(type);
        if (usersList != null) {
            return new ResponseEntity<List<Users>>(usersList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    //get email from token
    private String getEmailFromToken() {
        String email = "";
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return email;
    }
}
