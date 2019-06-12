package com.example.demo.service;

import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Student;
import com.example.demo.repository.Ojt_EnrollmentRepository;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Ojt_EnrollmentService {

    @Autowired
    Ojt_EnrollmentRepository ojtEnrollmentRepository;

    public boolean saveListOjtEnrollment(List<Ojt_Enrollment> ojtEnrollmentList) {
        ojtEnrollmentRepository.saveAll(ojtEnrollmentList);
        return true;
    }

    public List<Ojt_Enrollment> getAllOjt_Enrollment() {
        return ojtEnrollmentRepository.findAll();
    }

    public int getOjt_EnrollmentIdByBusinessEmail(String email){
        Ojt_Enrollment ojt_enrollment=ojtEnrollmentRepository.getOjt_EnrollmentByBusiness_Email(email);
        return ojt_enrollment.getId();
    }

    public void saveOjt_Enrollment(Ojt_Enrollment ojt_enrollment){
        ojtEnrollmentRepository.save(ojt_enrollment);
    }
}
