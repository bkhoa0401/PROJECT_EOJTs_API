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
        List<String> nameList = new ArrayList<>();

        for (int i = 0; i < studentList.size(); i++) {
            Users users = new Users();
            Specialized specialized = new Specialized();
            String specializedName = "";
            int specializedID = 0;

            users.setEmail(studentList.get(i).getEmail());
            String password = usersService.getAlphaNumericString();
            users.setPassword(password);
            nameList.add(studentList.get(i).getName());
            users.setRoles(roleList);

            specializedName = studentList.get(i).getSpecialized().getName();
            specializedID = specializedService.getIdByName(specializedName);
            specialized.setId(specializedID);
            studentList.get(i).setSpecialized(specialized);

            usersList.add(users);

            Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
            ojt_enrollment.setStudent(studentList.get(i));

            ojtEnrollmentList.add(ojt_enrollment);
        }

        try {
            studentService.saveListStudent(studentList);
            usersService.saveListUser(usersList);
            ojt_enrollmentService.saveListOjtEnrollment(ojtEnrollmentList);

            if (usersService.saveListUser(usersList)) {
                for (int i = 0; i < usersList.size(); i++) {
                    usersService.sendEmail(nameList.get(i), usersList.get(i).getEmail(), usersList.get(i).getPassword());
                }
            }

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
        List<Specialized> specializedList = specializedService.getAllSpecialized();
        if (specializedList != null) {
            return new ResponseEntity<List<Specialized>>(specializedList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // get list skill by specialized of student
    @GetMapping("/list-skill")
    @ResponseBody
    public ResponseEntity<List<Skill>> getListSkillOfStudentBySpecialized() {
        String email = getEmailFromToken();

        int specializedId = studentService.getSpecializedIdByEmail(email);

        List<Skill> skills = skillService.getListSkillBySpecialized(specializedId);

        if (skills != null) {
            return new ResponseEntity<List<Skill>>(skills, HttpStatus.OK);

        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("student/{email}")
    @ResponseBody
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        return new ResponseEntity<Student>(studentService.getStudentByEmail(email), HttpStatus.OK);
    }


    //update objective
    @PostMapping("/update-resume")
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
    @ResponseBody
    public ResponseEntity<List<Invitation>> getListInvitation() {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByStuddentEmail(email);
        if (invitationList != null) {
            return new ResponseEntity<List<Invitation>>(invitationList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //student get details invitation
    @GetMapping("/getInvitation")
    @ResponseBody
    public ResponseEntity<Invitation> getInvitation(@RequestParam int id) {

        Invitation invitation = invitationService.getInvitationById(id);
        if (invitation != null) {
            return new ResponseEntity<Invitation>(invitation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //return id of skill
    @GetMapping("/skill")
    @ResponseBody
    public ResponseEntity<Integer> getIdSkillByName(@RequestParam(value = "nameSkill") String nameSkill) {
        System.out.println(nameSkill);
        return new ResponseEntity<Integer>(skillService.fullTextSearch(nameSkill), HttpStatus.OK);
    }

    //update option 1 of student
    @PutMapping("/updateOption1")
    public ResponseEntity<String> updateOption1OfStudent(@RequestParam String option1) {
        String email = getEmailFromToken();
        boolean update = studentService.updateOption1Student(email, option1);
        if (update == true) {
            return new ResponseEntity<String>("success", HttpStatus.OK);
        }
        return new ResponseEntity<String>("fail", HttpStatus.EXPECTATION_FAILED);
    }

    //update option 2 of student
    @PutMapping("/updateOption2")
    public ResponseEntity<String> updateOption2OfStudent(@RequestParam String option2) {
        String email = getEmailFromToken();
        boolean update = studentService.updateOption2Student(email, option2);
        if (update == true) {
            return new ResponseEntity<String>("success", HttpStatus.OK);
        }
        return new ResponseEntity<String>("fail", HttpStatus.EXPECTATION_FAILED);
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
