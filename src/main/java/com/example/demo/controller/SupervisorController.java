package com.example.demo.controller;

import com.example.demo.entity.Evaluation;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Supervisor;
import com.example.demo.entity.Task;
import com.example.demo.service.EvaluationService;
import com.example.demo.service.Ojt_EnrollmentService;
import com.example.demo.service.SupervisorService;
import com.example.demo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Void> createNewEvaluation(@RequestBody Evaluation evaluation,@RequestParam String emailStudent){
        String email=getEmailFromToken();

        Supervisor supervisor=supervisorService.findByEmail(email);
        evaluation.setSupervisor(supervisor);

        evaluationService.createNewEvaluation(evaluation,emailStudent);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/evaluations")
    @ResponseBody
    public ResponseEntity<List<Evaluation>> getAllEvaluationBySupervisorEmail(){
        String email=getEmailFromToken();

        List<Evaluation> evaluationList=evaluationService.getEvaluationsBySupervisorEmail(email);
        if(evaluationList!=null){
            return new ResponseEntity<List<Evaluation>>(evaluationList,HttpStatus.OK);
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
