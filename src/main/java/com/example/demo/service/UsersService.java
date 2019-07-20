package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.IUsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.util.ArrayList;
import java.util.List;

@Service
public class UsersService implements IUsersService {
    @Autowired
    IUsersRepository IUsersRepository;

    @Autowired
    private JavaMailSender sender;

    @Autowired
    IRoleService roleService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISemesterService semesterService;

    @Override
    public void sendEmail(String name, String mail, String password) throws Exception {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setTo(mail);
        helper.setText("Hi " + name + ",\n" + "welcome you to my system.\n Your password are : " + password + "\nThanks and Regards");
        helper.setSubject("[TEST EOJTs]");

        sender.send(message);
    }

    @Override
    public String getAlphaNumericString() {
        String AlphaNumericString = "0123456789"
                + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                + "abcdefghijklmnopqrstuvxyz";
        StringBuilder sb = new StringBuilder(7);

        for (int i = 0; i < 7; i++) {
            int index
                    = (int) (AlphaNumericString.length()
                    * Math.random());
            sb.append(AlphaNumericString
                    .charAt(index));
        }
        return sb.toString();
    }

    @Override
    public Users findUserByEmail(String email) {
        Users users = IUsersRepository.findUserByEmail(email);
        if (users != null) {
            return users;
        }
        return null;
    }

    @Override
    public Users findUserByEmailAndPassWord(String email, String password) {
        Users users = IUsersRepository.findUserByEmailAndPassword(email, password);
        if (users != null) {
            return users;
        }
        return null;
    }

    @Override
    public boolean saveListUser(List<Users> usersList) {
        IUsersRepository.saveAll(usersList);
        return true;
    }

    @Override
    public boolean saveUser(Users users) {
        IUsersRepository.save(users);
        return true;
    }

    @Override
    public List<Users> getAllUsers() {
        return IUsersRepository.findAll();
    }

    @Override
    public boolean updatePasswordOfUserByEmail(String email, String password) {
        Users users = findUserByEmail(email);
        if (users != null) {
            users.setPassword(password);
            IUsersRepository.save(users);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateStatus(String email, boolean isActive) {
        Users users = IUsersRepository.findUserByEmail(email);
        if (users != null) {
            users.setActive(isActive);
            IUsersRepository.save(users);
            return true;
        }
        return false;
    }

    @Override
    public List<Users> getAllUsersByType(int type) {
        Role role = roleService.findRoleById(type);
        List<Role> roleList = new ArrayList<>();
        roleList.add(role);

        List<Users> usersList = IUsersRepository.findUsersByRoles(roleList);


        return usersList;
    }

    @Override
    public List<Users> getAllUsersBySemester() {
        Semester semester = semesterService.getSemesterCurrent();
        List<Users> usersListCurrentSemester = new ArrayList<>();
        List<Ojt_Enrollment> ojt_enrollmentList = new ArrayList<>();

        List<Users> usersList = getAllUsers();

        for (int i = 0; i < usersList.size(); i++) {
            Users users = usersList.get(i);
            List<Role> roleListOfUsers = users.getRoles();
            if (roleListOfUsers != null) {
                for (int j = 0; j < roleListOfUsers.size(); j++) {
                    Role role = roleListOfUsers.get(j);
                    if (role.getDescription().equals("ROLE_HR")) {
                        Ojt_Enrollment ojt_enrollmentOfHr = ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(users.getEmail(), semester.getId());
                        if (ojt_enrollmentOfHr != null) {
                            ojt_enrollmentList.add(ojt_enrollmentOfHr);
                        }
                    } else if (role.getDescription().equals("ROLE_STUDENT")) {
                        Ojt_Enrollment ojt_enrollmentOfStudent = ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(users.getEmail(), semester.getId());
                        if (ojt_enrollmentOfStudent != null) {
                            ojt_enrollmentList.add(ojt_enrollmentOfStudent);
                        }
                    }
                }
            }
        }
        for (int i = 0; i < ojt_enrollmentList.size(); i++) {
            Ojt_Enrollment ojt_enrollment = ojt_enrollmentList.get(i);
            if (ojt_enrollment.getStudent() == null) {
                Business business = ojt_enrollment.getBusiness();
                Users users = findUserByEmail(business.getEmail());
                usersListCurrentSemester.add(users);
            } else {
                Student student = ojt_enrollment.getStudent();
                Users users = findUserByEmail(student.getEmail());
                usersListCurrentSemester.add(users);
            }
        }
        if (usersListCurrentSemester != null) {
            return usersListCurrentSemester;
        }
        return null;
    }
}
