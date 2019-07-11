package com.example.demo.service;

import com.example.demo.entity.Business;
import com.example.demo.entity.Evaluation;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Supervisor;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class EvaluationService {
    @Autowired
    EvaluationRepository evaluationRepository;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    BusinessRepository businessRepository;

    @Autowired
    SupervisorService supervisorService;

    public void createNewEvaluation(Evaluation evaluation, String studentEmail) {

        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(studentEmail);

        Date date = new Date(Calendar.getInstance().getTime().getTime());
        evaluation.setOjt_enrollment(ojt_enrollment);
        evaluation.setTimeCreated(date);
        evaluationRepository.save(evaluation);
    }

    public List<Evaluation> getEvaluationsBySupervisorEmail(String email) {
        List<Evaluation> evaluationList = evaluationRepository.findEvaluationsBySupervisorEmail(email);
        if (evaluationList != null) {
            return evaluationList;
        }
        return null;
    }

    public List<Evaluation> getEvaluationsByStudentEmail(String email) {
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);

        List<Evaluation> evaluationList = evaluationRepository.findEvaluationsByOjt_enrollment(ojt_enrollment);
        if (evaluationList != null) {
            return evaluationList;
        }
        return null;
    }

    public int countEvaluation(String email) {
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);

        int count = evaluationRepository.countEvaluationByOjt_enrollment(ojt_enrollment);

        return count;
    }

    public Evaluation getEvaluationById(int id) {
        Evaluation evaluation = evaluationRepository.findById(id);
        if (evaluation != null) {
            return evaluation;
        }
        return null;
    }

    public List<Evaluation> getListEvaluationOfBusiness(String email) {
        List<Supervisor> supervisorList = supervisorService.getAllSupervisorOfABusiness(email);

        List<Evaluation> evaluationList = new ArrayList<>();
        for (int i = 0; i < supervisorList.size(); i++) {
            List<Evaluation> list = evaluationRepository.findEvaluationsBySupervisorEmail(supervisorList.get(i).getEmail());
            evaluationList.addAll(list);
        }
        
        if (evaluationList != null) {
            return evaluationList;
        }
        return null;
    }
}
