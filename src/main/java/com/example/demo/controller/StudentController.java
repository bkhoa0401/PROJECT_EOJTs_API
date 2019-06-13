package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PersistenceException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    StudentService studentService;

    @Autowired
    UsersService usersService;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    private SpecializedService specializedService;

    @Autowired
    SkillService skillService;

    @Autowired
    InvitationService invitationService;

    @PostMapping
    public ResponseEntity<Void> addListStudent(@RequestBody List<Student> studentList) throws Exception {

        List<Role> roleList = new ArrayList<>();
        Role role = new Role();
        role.setId(2);
        roleList.add(role);
        List<Users> usersList = new ArrayList<>();
        List<Ojt_Enrollment> ojtEnrollmentList = new ArrayList<>();

        for (int i = 0; i < studentList.size(); i++) {
            Users users = new Users();
            users.setEmail(studentList.get(i).getEmail());
            users.setPassword("default");
            users.setRoles(roleList);

            usersList.add(users);

            Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
            ojt_enrollment.setStudent(studentList.get(i));

            ojtEnrollmentList.add(ojt_enrollment);
        }

        try {
            studentService.saveListStudent(studentList);
            usersService.saveListUser(usersList);
            ojt_enrollmentService.saveListOjtEnrollment(ojtEnrollmentList);

//            for (int i = 0; i < studentList.size(); i++) {
//                usersService.sendEmail(studentList.get(i).getName(), studentList.get(i).getEmail());
//            }

        } catch (PersistenceException ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/getAllStudent")
    public ResponseEntity<List<Student>> getAllStudents() throws Exception {
        List<Student> studentList = new ArrayList<>();
        try {
            studentList = studentService.getAllStudents();

        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(studentList, HttpStatus.OK);
    }

    //get list skill by specialzed
    @GetMapping("/specialized")
    public ResponseEntity<List<Specialized>> getSpecializedList() {
        return new ResponseEntity<List<Specialized>>(specializedService.getAllSpecialized(), HttpStatus.OK);
    }

    // get list skill by specialized of student
    @GetMapping("/list-skill")
    public ResponseEntity<List<Skill>> getListSkillOfStudentBySpecialized() {
        String email = getEmailFromToken();

        int specializedId = studentService.getSpecializedIdByEmail(email);

        List<Skill> skills = skillService.getListSkillBySpecialized(specializedId);

        return new ResponseEntity<List<Skill>>(skills, HttpStatus.OK);
    }


    @PostMapping("/update-infor")
    public ResponseEntity<String> updateInforOfStudent(@RequestParam String objective, @RequestParam float gpa,
                                                       @RequestBody List<Skill> skillList) {
        String email = getEmailFromToken();
        boolean updateInfor = studentService.updateInforStudent(email, objective, gpa, skillList);
        if (updateInfor == false) {
            return new ResponseEntity<String>("fail", HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @GetMapping("/list-invitation")
    public ResponseEntity<List<Invitation>> getListInvitation(){
        String email=getEmailFromToken();
        List<Invitation> invitationList=invitationService.getListInvitationByStuddentEmail(email);
        return new ResponseEntity<List<Invitation>>(invitationList, HttpStatus.OK);
    }

    //return id of skill
    @GetMapping("/skill")
    public ResponseEntity<Integer> getIdSkillByName(@RequestParam(value = "nameSkill") String nameSkill) {
        return new ResponseEntity<Integer>(skillService.fullTextSearch(nameSkill), HttpStatus.OK);
    }

    //get email from token
    private String getEmailFromToken() {
        String email = "";
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return email;
    }

}
