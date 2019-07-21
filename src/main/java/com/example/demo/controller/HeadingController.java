package com.example.demo.controller;

import com.example.demo.entity.Business_Proposed;
import com.example.demo.repository.IBusiness_ProposedRepository;
import com.example.demo.service.IBusiness_ProposedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/heading")
public class HeadingController {

    @Autowired
    IBusiness_ProposedService iBusiness_proposedService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<Business_Proposed>> getListBusiness_Proposed(){
        List<Business_Proposed> business_proposeds=iBusiness_proposedService.getAll();
        if(business_proposeds!=null){
            return new ResponseEntity<List<Business_Proposed>>(business_proposeds, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }
}
