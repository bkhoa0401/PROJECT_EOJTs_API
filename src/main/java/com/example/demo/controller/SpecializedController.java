package com.example.demo.controller;

import com.example.demo.entity.Users;
import com.example.demo.service.SpecializedService;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/specialized")
public class SpecializedController {

    @Autowired
    SpecializedService specializedService;

    @GetMapping("/name")
    @ResponseBody
    public ResponseEntity<Integer> getIdSpecializedByName(@RequestParam(value = "nameSpecialized") String nameSpecialized) {
        return new ResponseEntity<Integer>(specializedService.getIdByName(nameSpecialized), HttpStatus.OK);
    }
}
