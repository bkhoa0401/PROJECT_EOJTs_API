package com.example.demo.controller;

import com.example.demo.dto.Business_ListJobPostDTO;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
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

    @Autowired
    UsersService usersService;

    @Autowired
    AdminService adminService;

    @Autowired
    BusinessService businessService;

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
        List<Student> studentListPassAllOption = studentService.getAllStudentByStatusOption(3); // pass 2 nv

        List<Student> listTotalStudentPassOnlyOption1OrOption2AndAll = new ArrayList<>();
        listTotalStudentPassOnlyOption1OrOption2AndAll.addAll(studentListPassOnlyOption1);
        listTotalStudentPassOnlyOption1OrOption2AndAll.addAll(studentListPassOnlyOption2);
        listTotalStudentPassOnlyOption1OrOption2AndAll.addAll(studentListPassAllOption);

        ojt_enrollmentService.updateStudentToBusinessPassOption1OrOption2(listTotalStudentPassOnlyOption1OrOption2AndAll);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //get all student to send inform message
    //check semester //ok
    @GetMapping("/students")
    @ResponseBody
    public ResponseEntity<List<Student>> getAllStudentToSendInform() {
       // List<Student> studentList = studentService.getAllStudents();
        List<Student> studentList =studentService.getAllStudentsBySemesterId();
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }



    //get all events of admin
    @GetMapping("/events")
    @ResponseBody
    public ResponseEntity<List<Event>> getAllEventOfAdmin() {
        String email = getEmailFromToken();
        List<Event> events = eventService.getEventListOfAdmin(email);
        if (events != null) {
            Collections.sort(events);
            return new ResponseEntity<List<Event>>(events, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    @PostMapping("/event")
    public ResponseEntity<Void> createEvent(@RequestParam List<String> listStudentEmail, @RequestBody Event event) {
        String email = getEmailFromToken();
        Users users = usersService.findUserByEmail(email);

        List<Role> roleListUsers = users.getRoles();

        for (int i = 0; i < roleListUsers.size(); i++) {
            int roleId = roleListUsers.get(i).getId();
            if (roleId == 1) {
                Admin admin = adminService.findAdminByEmail(email);
                event.setAdmin(admin);
            } else if (roleId == 3) {
                Business business = businessService.getBusinessByEmail(email);
                event.setBusiness(business);
            }
        }
        List<Student> studentList=new ArrayList<>();
        for (int i = 0; i < listStudentEmail.size(); i++) {
            Student student = studentService.getStudentByEmail(listStudentEmail.get(i));
            studentList.add(student);
        }
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        event.setTime_created(date);
        event.setStudents(studentList);
        boolean create = eventService.createEvent(event);
        if (create == true) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    @GetMapping("/jobPostsBusinesses")
    @ResponseBody
    public ResponseEntity<List<Business_ListJobPostDTO>> getJobPostsOfBusiness(){
        List<Business_ListJobPostDTO> business_listJobPostDTOS=adminService.getJobPostsOfBusinesses();

        if(business_listJobPostDTOS!=null){
            return new ResponseEntity<List<Business_ListJobPostDTO>>(business_listJobPostDTOS,HttpStatus.OK);
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
