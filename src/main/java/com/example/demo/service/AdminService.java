package com.example.demo.service;

import com.example.demo.dto.Business_JobPostDTO;
import com.example.demo.dto.Business_ListJobPostDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {
    @Autowired
    AdminRepository adminRepository;

    @Autowired
    BusinessService businessService;

    @Autowired
    Job_PostService job_postService;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    SemesterService semesterService;

    public Admin findAdminByEmail(String email) {
        Admin admin = adminRepository.findAdminByEmail(email);
        if (admin != null) {
            return admin;
        }
        return null;
    }

    //check semester // ok
    public List<Business_ListJobPostDTO> getJobPostsOfBusinesses() {
       // List<Business> businessList = businessService.getAllBusiness();

        List<Business> businessList = businessService.getAllBusinessBySemester();
        List<Business_ListJobPostDTO> business_listJobPostDTOS = new ArrayList<>();

        for (int i = 0; i < businessList.size(); i++) {

            //Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_enrollmentOfBusiness(businessList.get(i));
            Semester semesterCurrent=semesterService.getSemesterCurrent();
            Ojt_Enrollment ojt_enrollment=
                    ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessList.get(i).getEmail(),semesterCurrent.getId());

            List<Job_Post> job_postList = job_postService.getAllJobPostOfBusiness(ojt_enrollment);

            Business_ListJobPostDTO business_jobPostDTO = new Business_ListJobPostDTO();
            business_jobPostDTO.setJob_postList(job_postList);
            business_jobPostDTO.setBusiness(businessList.get(i));

            business_listJobPostDTOS.add(business_jobPostDTO);
        }
        return business_listJobPostDTOS;
    }
}
