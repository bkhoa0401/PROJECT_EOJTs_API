package com.example.demo.service;

import com.example.demo.entity.Business_Proposed;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Semester;
import com.example.demo.entity.Student;
import com.example.demo.repository.IBusiness_ProposedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class Business_ProposedService implements IBusiness_ProposedService {

    @Autowired
    IBusiness_ProposedRepository iBusiness_proposedRepository;

    @Autowired
    ISemesterService iSemesterService;

    @Autowired
    IOjt_EnrollmentService iOjt_enrollmentService;

    @Override
    public List<Business_Proposed> getAll() {

        Semester semester = iSemesterService.getSemesterCurrent();
        List<Business_Proposed> business_proposeds = iBusiness_proposedRepository.findAll();

        List<Business_Proposed> business_proposedsSemesterCurrent = new ArrayList<>();
        ;

        for (int i = 0; i < business_proposeds.size(); i++) {
            Student student = business_proposeds.get(i).getStudent_proposed();
            Ojt_Enrollment ojt_enrollment = iOjt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(student.getEmail(), semester.getId());
            if (ojt_enrollment != null) {
                business_proposedsSemesterCurrent.add(business_proposeds.get(i));
            }
        }
        return business_proposedsSemesterCurrent;
    }

}
