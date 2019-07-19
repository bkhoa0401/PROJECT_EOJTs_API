package com.example.demo.service;

import com.example.demo.dto.Business_ListJobPostDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.IAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService implements IAdminService{
    @Autowired
    IAdminRepository IAdminRepository;

    @Autowired
    IBusinessService businessService;

    @Autowired
    IJob_PostService job_postService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISemesterService semesterService;

    @Override
    public Admin findAdminByEmail(String email) {
        Admin admin = IAdminRepository.findAdminByEmail(email);
        if (admin != null) {
            return admin;
        }
        return null;
    }

    //check semester // ok
    @Override
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
