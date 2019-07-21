package com.example.demo.controller;

import com.example.demo.entity.Business;
import com.example.demo.entity.Specialized;
import com.example.demo.entity.Users;
import com.example.demo.service.ISpecializedService;
import com.example.demo.service.SpecializedService;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/specialized")
public class SpecializedController {

    @Autowired
    ISpecializedService specializedService;

    @GetMapping("/name")
    @ResponseBody
    public ResponseEntity<Integer> getIdSpecializedByName(@RequestParam(value = "nameSpecialized") String nameSpecialized) {
        return new ResponseEntity<Integer>(specializedService.getIdByName(nameSpecialized), HttpStatus.OK);
    }


    @GetMapping
    @ResponseBody
    public ResponseEntity<List<Specialized>> getAllSpecialized() {
        HttpStatus httpStatus;
        List<Specialized> specializedList = new ArrayList<>();

        specializedList = specializedService.getAllSpecialized();

        if (specializedList != null) {
            httpStatus = HttpStatus.OK;
            return new ResponseEntity<List<Specialized>>(specializedList, httpStatus);
        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<List<Specialized>>(specializedList, httpStatus);
        }
    }

//    @GetMapping("/top")
//    @ResponseBody
//    public ResponseEntity<List<Specialized>> getTop() {
//        List<Specialized> specializedList = specializedService.getTop2();
//        return new ResponseEntity<>(specializedList, HttpStatus.OK);
//    }


    @GetMapping("/id")
    @ResponseBody
    public ResponseEntity<Specialized> getSpecializedById(@RequestParam int id) {
        HttpStatus httpStatus;
        Specialized specialized = specializedService.getSpecializedById(id);

        if (specialized != null) {
            httpStatus = HttpStatus.OK;
            return new ResponseEntity<Specialized>(specialized, httpStatus);
        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<Specialized>(specialized, httpStatus);
        }
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<String> createSpecialized(@RequestBody Specialized specialized) {
        String result = "Failed";
        HttpStatus httpStatus;

        int specializedId = specializedService.fullTextSearch(specialized.getName());

        if (specializedId == 0) {
            if (specializedService.createSpecialized(specialized)) {
                result = "Success";
                httpStatus = HttpStatus.OK;
            } else {
                httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        } else {
            httpStatus = HttpStatus.CONFLICT;
        }
        return new ResponseEntity<String>(result, httpStatus);
    }

    @PutMapping
    @ResponseBody
    public ResponseEntity<List<Specialized>> updateSpecialized(@RequestBody Specialized specialized) {
        List<Specialized> result = specializedService.updateSpecialized(specialized);
        if (result != null) {
            return new ResponseEntity<List<Specialized>>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @PutMapping("/status")
    @ResponseBody
    public ResponseEntity<Boolean> updateStatusSpecialized(@RequestParam int id, @RequestParam boolean status) {
        boolean result = specializedService.updateStatusSpecialized(id, status);
        if (result == true) {
            return new ResponseEntity<Boolean>(result, HttpStatus.OK);
        }
        return new ResponseEntity<Boolean>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
