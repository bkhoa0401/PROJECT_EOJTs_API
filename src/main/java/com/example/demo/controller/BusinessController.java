package com.example.demo.controller;

import com.example.demo.entity.Business;
import com.example.demo.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/business")
public class BusinessController {
    @Autowired
    private BusinessService businessService;


    @PostMapping
    public ResponseEntity<Void> importFileBusiness(@RequestBody List<Business> listBusiness) {

        businessService.importFileBusiness(listBusiness);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
