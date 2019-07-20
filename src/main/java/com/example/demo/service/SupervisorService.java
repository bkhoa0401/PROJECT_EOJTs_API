package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.SupervisorRepository;
import com.example.demo.utils.Utils;
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

    @Autowired
    UsersService usersService;

    @Autowired
    SemesterService semesterService;


    public Supervisor findByEmail(String email) {
        return supervisorRepository.findByEmail(email);
    }

    //check semester // ok
    public List<Supervisor> getAllSupervisorOfABusiness(String emailBusiness) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());

        List<Supervisor> supervisors = supervisorRepository.findSupervisorsByOjt_enrollmentAndActiveIsTrue(ojt_enrollment);

        for (int i = 0; i < supervisors.size(); i++) {
            if (supervisors.get(i).isActive() == false) {
                supervisors.remove(supervisors.get(i));
            }
        }
        if (supervisors != null) {
            return supervisors;
        }
        return null;
    }

    //check semester //ok
    public boolean createSupervisor(Supervisor supervisor, String emailBusiness) {
        Supervisor supervisorFound = supervisorRepository.findByEmail(supervisor.getEmail());
        if (supervisorFound == null) {
            Semester semesterCurrent = semesterService.getSemesterCurrent();

            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());
            supervisor.setOjt_enrollment(ojt_enrollment);
            supervisorRepository.save(supervisor);

            String password = usersService.getAlphaNumericString();

            usersService.saveUser(new Users(supervisor.getEmail(), password));
            return true;
        }
        return false;
    }

    public boolean updateStateSupervisor(String email, boolean isActive) {
        Supervisor supervisor = supervisorRepository.findByEmail(email);
        Users users = usersService.findUserByEmail(supervisor.getEmail());

        if (supervisor != null) {
            users.setActive(isActive);
            supervisor.setActive(isActive);
            supervisorRepository.save(supervisor);
            return true;
        }
        return false;
    }


}
