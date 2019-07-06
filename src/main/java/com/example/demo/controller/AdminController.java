package com.example.demo.controller;

import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Student;
import com.example.demo.service.Ojt_EnrollmentService;
import com.example.demo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    StudentService studentService;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<Student>> getAllStudentByTypeStatusOption(@RequestParam int typeOfStatus) {
        List<Student> studentList = studentService.getAllStudentByStatusOption(typeOfStatus);
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping
    public ResponseEntity<Void> updateStudentToBusinessPassOption1OrOption2() {
        List<Student> studentListPassOnlyOption1 = studentService.getAllStudentByStatusOption(1); // only pass nv1
        List<Student> studentListPassOnlyOption2 = studentService.getAllStudentByStatusOption(2); // only pass nv2

        List<Student> listTotalStudentPassOnlyOption1OrOption2 = new ArrayList<>();
        listTotalStudentPassOnlyOption1OrOption2.addAll(studentListPassOnlyOption1);
        listTotalStudentPassOnlyOption1OrOption2.addAll(studentListPassOnlyOption2);

        ojt_enrollmentService.updateStudentToBusinessPassOption1OrOption2(listTotalStudentPassOnlyOption1OrOption2);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //get all student to send inform message
    @GetMapping("/students")
    @ResponseBody
    public ResponseEntity<List<Student>> getAllStudentToSendInform() {
        List<Student> studentList = studentService.getAllStudents();
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }
}
