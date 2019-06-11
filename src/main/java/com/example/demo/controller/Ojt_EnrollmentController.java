package com.example.demo.controller;

import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.service.Ojt_EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/ojt_enrollment")
public class Ojt_EnrollmentController {

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @GetMapping
    public ResponseEntity<List<Ojt_Enrollment>> getAllOjt_Enrollment() throws Exception {
        List<Ojt_Enrollment> ojtEnrollmentList = new ArrayList<>();
        try {
            ojtEnrollmentList = ojt_enrollmentService.getAllOjt_Enrollment();

        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(ojtEnrollmentList, HttpStatus.OK);
    }
}
