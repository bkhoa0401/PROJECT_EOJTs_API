package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/supervisor")
public class SupervisorController {

    @Autowired
    TaskService taskService;

    @Autowired
    SupervisorService supervisorService;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    EvaluationService evaluationService;

    @Autowired
    StudentService studentService;

    @PostMapping("")
    public ResponseEntity<Void> createNewTask(@RequestBody Task task, @RequestParam String emailStudent) {
        String email = getEmailFromToken();
        Supervisor supervisor = supervisorService.findByEmail(email);

        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(emailStudent);

        task.setOjt_enrollment(ojt_enrollment);
        task.setSupervisor(supervisor);
        taskService.createTaskForStudent(task);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/tasks")
    @ResponseBody
    public ResponseEntity<List<Task>> findTasksBySupervisorEmail() {
        String email = getEmailFromToken();
        List<Task> taskList = taskService.findTaskBySupervisorEmail(email);
        if (taskList != null) {
            return new ResponseEntity<List<Task>>(taskList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PostMapping("/evaluation")
    public ResponseEntity<Void> createNewEvaluation(@RequestBody Evaluation evaluation, @RequestParam String emailStudent) {
        String email = getEmailFromToken();

        Supervisor supervisor = supervisorService.findByEmail(email);
        evaluation.setSupervisor(supervisor);

        evaluationService.createNewEvaluation(evaluation, emailStudent);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/evaluations")
    @ResponseBody
    public ResponseEntity<List<Evaluation>> getAllEvaluationBySupervisorEmail() {
        String email = getEmailFromToken();

        List<Evaluation> evaluationList = evaluationService.getEvaluationsBySupervisorEmail(email);
        if (evaluationList != null) {
            return new ResponseEntity<List<Evaluation>>(evaluationList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/students")
    @ResponseBody
    public ResponseEntity<List<Student>> getAllStudentBySupervisorEmail() {
        String email = getEmailFromToken();

        List<Student> studentList = studentService.getAllStudentOfASupervisor(email);
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/taskByStudentEmail")
    @ResponseBody
    public ResponseEntity<List<Task>> getTasksOfStudent(@RequestParam String emailStudent) {

        List<Task> taskList = taskService.findTaskByStudentEmail(emailStudent);
        if (taskList != null) {
            return new ResponseEntity<List<Task>>(taskList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/task")
    @ResponseBody
    public ResponseEntity<Task> getTaskById(@RequestParam int id) {
        Task task = taskService.findTaskById(id);
        if (task != null) {
            return new ResponseEntity<Task>(task, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/task")
    public ResponseEntity<Void> updateTask(@RequestBody Task task, @RequestParam String emailStudent) {
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(emailStudent);

        task.setOjt_enrollment(ojt_enrollment);
        boolean update = taskService.updateTask(task);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @DeleteMapping("/task")
    public ResponseEntity<Void> deleteTask(@RequestParam int id) {
        boolean delete = taskService.deleteTask(id);
        if (delete == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/stateTask")
    public ResponseEntity<Void> updateStateTask(@RequestParam int id, @RequestParam boolean state) {
        boolean updateStateTask = taskService.updateStateTask(id, state);
        if (updateStateTask == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    @GetMapping("/sms")
    public ResponseEntity<String> sendSms() {
        SmsService api = new SmsService("pdq_X8f0LCu68sMHzPQGfHQb9t1JqTxP");

        String result = null;
        try {
            result = api.sendSMS("0335554120", "hello", 6, "");
            return new ResponseEntity<String>(result, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<String>(result, HttpStatus.EXPECTATION_FAILED);
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
