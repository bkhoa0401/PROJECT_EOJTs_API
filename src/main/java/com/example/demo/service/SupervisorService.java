package com.example.demo.service;

import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.ISupervisorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SupervisorService implements ISupervisorService {
    @Autowired
    ISupervisorRepository ISupervisorRepository;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IBusinessService businessService;

    @Autowired
    IUsersService usersService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IStudentService iStudentService;


    @Override
    public Supervisor findByEmail(String email) {
        return ISupervisorRepository.findByEmail(email);
    }

    //check semester // ok
    @Override
    public List<Supervisor> getAllSupervisorOfABusiness(String emailBusiness) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());
        List<Supervisor> supervisors = ISupervisorRepository.findSupervisorsByBusinessEmail(ojt_enrollment.getBusiness().getEmail());

        if (supervisors != null) {
            return supervisors;
        }
        return null;
    }

    //check semester //ok
    @Override
    public boolean createSupervisor(Supervisor supervisor, String emailBusiness) {
        Supervisor supervisorFound = ISupervisorRepository.findByEmail(supervisor.getEmail());
        if (supervisorFound == null) {
            Semester semesterCurrent = semesterService.getSemesterCurrent();

            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());
            supervisor.setBusiness(ojt_enrollment.getBusiness());
            supervisor.setActive(true);
            ISupervisorRepository.save(supervisor);

            String password = usersService.getAlphaNumericString();

            Users users = new Users(supervisor.getEmail(), password);
            users.setActive(true);

            List<Role> roleList = new ArrayList<>();
            Role role = new Role();
            role.setId(4);
            roleList.add(role);

            users.setRoles(roleList);

            usersService.saveUser(users);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateStateSupervisor(String email, boolean isActive) {

        Supervisor supervisor = ISupervisorRepository.findByEmail(email);
        Users users = usersService.findUserByEmail(supervisor.getEmail());
        if (supervisor != null) {
            users.setActive(isActive);
            supervisor.setActive(isActive);
            ISupervisorRepository.save(supervisor);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateSupervisor(Supervisor supervisor) {
        Supervisor supervisorFindByEmail = ISupervisorRepository.findByEmail(supervisor.getEmail());
        if (supervisorFindByEmail != null) {
            ISupervisorRepository.save(supervisor);
            return true;
        }
        return false;
    }



}
