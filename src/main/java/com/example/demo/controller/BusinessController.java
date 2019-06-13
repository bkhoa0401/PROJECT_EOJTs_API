package com.example.demo.controller;

import com.example.demo.dto.BusinessDTO;
import com.example.demo.dto.Business_JobPostDTO;
import com.example.demo.entity.Business;
import com.example.demo.entity.Job_Post;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.service.BusinessImportFileService;
import com.example.demo.service.BusinessService;
import com.example.demo.service.Ojt_EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/business")
public class BusinessController {
    @Autowired
    private BusinessService businessService;

    @Autowired
    private Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    private BusinessImportFileService businessImportFileService;


    @PostMapping("")
    public ResponseEntity<Void> saveBusiness(@RequestBody List<BusinessDTO> listBusinessDTO) throws Exception {
        for (int i=0;i<listBusinessDTO.size();i++){
            businessImportFileService.insertBusiness(listBusinessDTO.get(i));
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/getAllBusiness")
    public ResponseEntity<List<Business>> getAllBusiness(){
        List<Business> businessList=businessService.getAllBusiness();
        return new ResponseEntity<List<Business>>(businessList,HttpStatus.CREATED);
    }

    //loi
//    @GetMapping("/getAllJobPost-Business")
//    public ResponseEntity<List<Business_JobPostDTO>> getAllJobPostBusiness(){
//        List<Business> businessList=businessService.getAllBusiness();
//        List<Business_JobPostDTO> business_jobPostDTOS=new ArrayList<>();
//        for (int i=0;i<businessList.size();i++){
//            Business_JobPostDTO business_jobPostDTO=new Business_JobPostDTO();
//            business_jobPostDTO.setBusiness(businessList.get(i));
//            business_jobPostDTO.setJob_postList(businessList.get(i).getOjt_enrollments().get(0).getJob_posts());
//
//            business_jobPostDTOS.add(business_jobPostDTO);
//        }
//        return new ResponseEntity<List<Business_JobPostDTO>>(business_jobPostDTOS,HttpStatus.CREATED);
//    }
}
