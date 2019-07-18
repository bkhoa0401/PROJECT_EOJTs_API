package com.example.demo.controller;

import com.example.demo.dto.SupervisorDTO;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.sql.Date;

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

    @Autowired
    SemesterService semesterService;

    @GetMapping("")
    @ResponseBody
    public ResponseEntity<SupervisorDTO> getSupervisorDetails() {
        String email = getEmailFromToken();

        SupervisorDTO supervisorDTO = new SupervisorDTO();

        Supervisor supervisor = supervisorService.findByEmail(email);
        supervisorDTO.setSupervisor(supervisor);
        supervisorDTO.setBusiness(supervisor.getOjt_enrollment().getBusiness());
        if (supervisor != null) {
            return new ResponseEntity<SupervisorDTO>(supervisorDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester // ok
    @PostMapping("")
    public ResponseEntity<Void> createNewTask(@RequestBody Task task, @RequestParam String emailStudent) {
        String email = getEmailFromToken();
        Supervisor supervisor = supervisorService.findByEmail(email);
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(emailStudent, semesterCurrent.getId());

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

    //update evaluation
    @PutMapping("/updateEvaluation")
    public ResponseEntity<Void> updateEvaluationById(@RequestParam int id, @RequestBody Evaluation evaluation) {
        boolean update = evaluationService.updateEvaluation(id, evaluation);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getEvaluation")
    @ResponseBody
    public ResponseEntity<Evaluation> getEvaluationById(@RequestParam int id) {
        Evaluation evaluation = evaluationService.getEvaluationById(id);
        return new ResponseEntity<Evaluation>(evaluation, HttpStatus.OK);
    }

    //get all evaluations of a supervisor by semester
    //check semester // ok
    @GetMapping("/business")
    @ResponseBody
    public ResponseEntity<Business> getBusinessOfEvaluation(@RequestParam String email) {
        Supervisor supervisor = supervisorService.findByEmail(email);
        Business business = supervisor.getOjt_enrollment().getBusiness();
        if (business != null) {
            return new ResponseEntity<Business>(business, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/supervisor")
    @ResponseBody
    public ResponseEntity<Supervisor> getSupervisorOfEvaluation(@RequestParam String email) {
        Supervisor supervisor = supervisorService.findByEmail(email);
        if (supervisor != null) {
            return new ResponseEntity<Supervisor>(supervisor, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/evaluations")
    @ResponseBody
    public ResponseEntity<List<Evaluation>> getAllEvaluationBySupervisorEmail() {
        String email = getEmailFromToken();

        //get all evaluation of supervisor in a semester
        List<Evaluation> evaluationList = evaluationService.getEvaluationsBySupervisorEmail(email);
        //get all student of supervisor in a semester
        List<Student> studentList = studentService.getAllStudentOfASupervisor(email);
        List<Evaluation> overviewEvaluationList = new ArrayList<Evaluation>();
        int flag = 0;
        for (int i = 0; i < studentList.size(); i++) {
            flag = 0;
            for (int j = 0; j < evaluationList.size(); j++) {
                if (studentList.get(i).getCode().equals(evaluationList.get(j).getOjt_enrollment().getStudent().getCode())) {
                    overviewEvaluationList.add(evaluationList.get(j));
                    if (flag > 0) {
                        for (int k = 1; k <= flag; k++) {
                            Date date1 = overviewEvaluationList.get(overviewEvaluationList.size() - k).getTimeStart();
                            Date date2 = overviewEvaluationList.get(overviewEvaluationList.size() - 1 - k).getTimeStart();
                            if (date1.before(date2)) {
                                Evaluation tmpEvaluation = overviewEvaluationList.get(overviewEvaluationList.size() - 1 - k);
                                overviewEvaluationList.set(overviewEvaluationList.size() - 1 - k, overviewEvaluationList.get(overviewEvaluationList.size() - k));
                                overviewEvaluationList.set(overviewEvaluationList.size() - k, tmpEvaluation);
                            }
                        }
                    }
                    flag++;
                }
            }
            if (flag < 4) {
                for (int l = flag; l < 4; l++) {
                    overviewEvaluationList.add(null);
                }
            }
        }
        Semester semester = semesterService.getSemesterCurrent();
        for (int i = 0; i < overviewEvaluationList.size(); i++) {
            Evaluation evaluation=overviewEvaluationList.get(i);
            if(evaluation!=null){
                if (evaluation.getOjt_enrollment().getSemester().getId() != semester.getId()) {
                    overviewEvaluationList.remove(overviewEvaluationList.get(i));
                }
            }
        }
        if (overviewEvaluationList != null) {
            return new ResponseEntity<List<Evaluation>>(overviewEvaluationList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
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

    //check semester //ok
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

    //check semester //ok
    @PutMapping("/task")
    public ResponseEntity<Void> updateTask(@RequestBody Task task, @RequestParam String emailStudent) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(emailStudent, semesterCurrent.getId());

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
    public ResponseEntity<Void> updateStateTask(@RequestParam int id, @RequestParam int typeTask) {
        boolean updateStateTask = taskService.updateStatusTask(id, typeTask);
        if (updateStateTask == true) {
            return new ResponseEntity<>(HttpStatus.OK);
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
