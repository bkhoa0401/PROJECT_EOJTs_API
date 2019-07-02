package com.example.demo.service;

import com.example.demo.entity.Business;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Supervisor;
import com.example.demo.repository.SupervisorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupervisorService {
    @Autowired
    SupervisorRepository supervisorRepository;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    BusinessService businessService;

    public Supervisor findByEmail(String email){
        return supervisorRepository.findByEmail(email);
    }

    public List<Supervisor> getAllSupervisorOfABusiness(String emailBusiness) {
        Business business = businessService.getBusinessByEmail(emailBusiness);
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_enrollmentOfBusiness(business);

        List<Supervisor> supervisors = supervisorRepository.findSupervisorsByOjt_enrollment(ojt_enrollment);
        if (supervisors != null) {
            return supervisors;
        }
        return null;
    }

    public boolean createSupervisor(Supervisor supervisor, String emailBusiness) {
        Supervisor supervisorFound = supervisorRepository.findByEmail(supervisor.getEmail());
        if (supervisorFound == null) {
            Business business = businessService.getBusinessByEmail(emailBusiness);
            Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_enrollmentOfBusiness(business);
            supervisor.setOjt_enrollment(ojt_enrollment);
            supervisorRepository.save(supervisor);
            return true;
        }
        return false;
    }

    public boolean updateStateSupervisor(String email,boolean isActive){
        Supervisor supervisor=supervisorRepository.findByEmail(email);
        if(supervisor!=null){
            supervisor.setActive(isActive);
            supervisorRepository.save(supervisor);
            return true;
        }
        return false;
    }


}
