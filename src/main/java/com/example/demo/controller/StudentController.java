package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.Ojt_EnrollmentService;
import com.example.demo.service.SpecializedService;
import com.example.demo.service.StudentService;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
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

    //get student by email
    @GetMapping("student/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable  String email) {
        return new ResponseEntity<Student>(studentService.getStudentByEmail(email), HttpStatus.OK);
    }
}
