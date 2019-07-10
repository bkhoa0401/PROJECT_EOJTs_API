package com.example.demo.service;

import com.example.demo.entity.Evaluation;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;

@Service
public class EvaluationService {
    @Autowired
    EvaluationRepository evaluationRepository;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

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
}
