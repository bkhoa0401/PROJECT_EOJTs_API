package com.example.demo.controller;

import com.example.demo.entity.Event;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Student;
import com.example.demo.service.EventService;
import com.example.demo.service.Ojt_EnrollmentService;
import com.example.demo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    StudentService studentService;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    EventService eventService;

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

    //get all events of admin
    @GetMapping("/events")
    @ResponseBody
    public ResponseEntity<List<Event>> getAllEventOfAdmin(){
        String email=getEmailFromToken();
        List<Event> events=eventService.getEventListOfAdmin(email);
        if(events!=null){
            Collections.sort(events);
            return new ResponseEntity<List<Event>>(events,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
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
