package com.example.demo.controller;

import com.example.demo.dto.Business_ListJobPostDTO;

import com.example.demo.dto.Businesses_StudentsDTO;

import com.example.demo.dto.Businesses_OptionsDTO;

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
    IStudentService studentService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IEventService eventService;

    @Autowired
    IUsersService usersService;

    @Autowired
    IAdminService adminService;

    @Autowired
    IBusinessService businessService;

    @Autowired
    ISemesterService semesterService;

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
        List<Student> studentList = studentService.getAllStudentsBySemesterId();
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    //get all events of admin
    //check semester ok
    @GetMapping("/events")
    @ResponseBody
    public ResponseEntity<List<Event>> getAllEventOfAdmin() {
        String email = getEmailFromToken();
        List<Event> events = eventService.getEventListOfAdmin(email);
        Semester semester = semesterService.getSemesterCurrent();
        Date dateStartSemester = semester.getStart_date();
        Date dateEndSemester = semester.getEnd_date();
        List<Event> finalListEvent = new ArrayList<Event>();
        for (int i = 0; i < events.size(); i++) {
            Date dateEventCreate = events.get(i).getTime_created();
            if (dateEventCreate.after(dateStartSemester) && dateEventCreate.before(dateEndSemester)) {
                finalListEvent.add(events.get(i));
            }
        }
        if (finalListEvent != null) {
            Collections.sort(finalListEvent);
            return new ResponseEntity<List<Event>>(finalListEvent, HttpStatus.OK);
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
        event.setStudents(studentList);
        boolean create = eventService.createEvent(event);
        if (create == true) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    @GetMapping("/jobPostsBusinesses")
    @ResponseBody
    public ResponseEntity<List<Business_ListJobPostDTO>> getJobPostsOfBusiness() {
        List<Business_ListJobPostDTO> business_listJobPostDTOS = adminService.getJobPostsOfBusinesses();

        if (business_listJobPostDTOS != null) {
            return new ResponseEntity<List<Business_ListJobPostDTO>>(business_listJobPostDTOS, HttpStatus.OK);
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

    //Not doing anything from this//get suggested business for student
    @GetMapping("/getSuggestedBusinessForFail")
    @ResponseBody
    private ResponseEntity<List<Business>> getSuggestedBusinessForFail(@RequestParam String email) {
        Student suggestStudent = studentService.getStudentByEmail(email);
        List<Business> listSuggestBusiness = adminService.getSuggestedBusinessListForFail(suggestStudent);
        if (listSuggestBusiness != null) {
            return new ResponseEntity<List<Business>>(listSuggestBusiness, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get business has job_post in specific specialized
    @GetMapping("/getOtherBusiness")
    @ResponseBody
    private ResponseEntity<List<Business>> getOtherBusiness(@RequestParam String email) {
        Student suggestStudent = studentService.getStudentByEmail(email);
        List<Business> listBusiness = businessService.getAllBusinessBySemester();
        List<Business> listSuggestBusiness = adminService.getSuggestedBusinessListForFail(suggestStudent);
        List<Business> listOtherBusiness = new ArrayList<>();
        for (int i = 0; i < listBusiness.size(); i++) {
            if (!listBusiness.get(i).getBusiness_eng_name().equals(suggestStudent.getOption1()) &&
                    !listBusiness.get(i).getBusiness_eng_name().equals(suggestStudent.getOption2()) &&
                    !listSuggestBusiness.contains(listBusiness.get(i))) {
                listOtherBusiness.add(listBusiness.get(i));
            }
        }
        List<Business> finalList = adminService.filterListBusinessByStudentSpecialized(suggestStudent.getSpecialized().getId(), listOtherBusiness);
        if (finalList != null) {
            return new ResponseEntity<List<Business>>(finalList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    //set business for student by student id
    @PutMapping("/setBusinessForStudent")
    public ResponseEntity<Void> setBusinessForStudent(@RequestParam String emailOfBusiness, @RequestParam String emailOfStudent) {
        boolean setStatus = ojt_enrollmentService.setBusinessForStudent(emailOfBusiness, emailOfStudent);
        if (setStatus == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/studentOptionPerBusiness")
    @ResponseBody
    public ResponseEntity<Businesses_OptionsDTO> getStudentOptionPerBusiness() {
        Businesses_OptionsDTO businesses_optionsDTO = adminService.getBusinesses_OptionDTO();

        if (businesses_optionsDTO != null) {
            return new ResponseEntity<>(businesses_optionsDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //dem so luong hs thuc tap tai 1 dn
    @GetMapping("/business-students")
    @ResponseBody
    public ResponseEntity<Businesses_StudentsDTO> countStudentAtABusiness(){
        Businesses_StudentsDTO businesses_studentsDTO=adminService.getBusinesses_StudentsDTO();
        if(businesses_studentsDTO!=null){
            return new ResponseEntity<Businesses_StudentsDTO>(businesses_studentsDTO,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }
}
