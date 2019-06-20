package com.example.demo.service;

import com.example.demo.entity.Business;
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

    @Autowired
    BusinessService businessService;

    public boolean saveListOjtEnrollment(List<Ojt_Enrollment> ojtEnrollmentList) {
        ojtEnrollmentRepository.saveAll(ojtEnrollmentList);
        return true;
    }

    public List<Ojt_Enrollment> getAllOjt_Enrollment() {
        return ojtEnrollmentRepository.findAll();
    }

    public int getOjt_EnrollmentIdByBusinessEmail(String email) {
        Ojt_Enrollment ojt_enrollment = ojtEnrollmentRepository.getOjt_EnrollmentByBusiness_Email(email);
        return ojt_enrollment.getId();
    }

    public Ojt_Enrollment getOjt_EnrollmentByStudentEmail(String email) {
        Ojt_Enrollment ojt_enrollment = ojtEnrollmentRepository.getOjt_EnrollmentByStudentEmail(email);
        return ojt_enrollment;
    }


    public void updateStudentToBusinessPassOption1OrOption2(List<Student> studentList) {
        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            if (student.isAcceptedOption1() == true) {
                Business businessOption1 = businessService.findBusinessByName(student.getOption1());

                Ojt_Enrollment ojt_enrollment = getOjt_EnrollmentByStudentEmail(student.getEmail());

                ojt_enrollment.setBusiness(businessOption1);

                ojtEnrollmentRepository.save(ojt_enrollment);
            } else if (student.isAcceptedOption2() == true) {
                Business businessOption2 = businessService.findBusinessByName(student.getOption2());

                Ojt_Enrollment ojt_enrollment = getOjt_EnrollmentByStudentEmail(student.getEmail());

                ojt_enrollment.setBusiness(businessOption2);

                ojtEnrollmentRepository.save(ojt_enrollment);
            }
        }
    }
}
