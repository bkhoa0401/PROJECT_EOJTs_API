package com.example.demo.controller;

import com.example.demo.dto.EventDTO;
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
@RequestMapping("/api/event")
public class EventController {

    @Autowired
    IEventService eventService;

    @Autowired
    IUsersService usersService;

    @Autowired
    IAdminService adminService;

    @Autowired
    IBusinessService businessService;

    @Autowired
    IStudentService studentService;

    @Autowired
    IStudent_EventService iStudent_eventService;

    @GetMapping("/getEvent")
    @ResponseBody
    public ResponseEntity<EventDTO> getEventById(@RequestParam int id) {
        EventDTO eventDTO = eventService.findEventAndStudentsById(id);
        if (eventDTO.getStudentList().size() == 1 && eventDTO.getEvent().getStudent_events().get(0).isStudent() == true) {
            eventDTO.setStudentSent(true);
        } else {
            eventDTO.setStudentSent(false);
        }
        if (eventDTO != null) {
            return new ResponseEntity<EventDTO>(eventDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/setStateEvent")
    @ResponseBody
    public ResponseEntity<Void> setStateEvent(@RequestParam Integer eventId) {
        Event event = eventService.findEventById(eventId);
        if (event != null) {
            event.setRead(true);
            boolean result = eventService.updateEvent(event);
            return new ResponseEntity<Void>(HttpStatus.OK);
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
        List<Student> studentList = new ArrayList<>();
        for (int i = 0; i < listStudentEmail.size(); i++) {
            Student student = studentService.getStudentByEmail(listStudentEmail.get(i));
            studentList.add(student);
        }
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        event.setTime_created(date);
        //event.setStudents(studentList);
        boolean create = eventService.createEvent(event);

        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            Student_Event student_event = new Student_Event();
            student_event.setStudent(student);
            student_event.setEvent(event);
            student_event.setStudent(false);

            iStudent_eventService.saveStudentEvent(student_event);
        }
        if (create == true) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

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
