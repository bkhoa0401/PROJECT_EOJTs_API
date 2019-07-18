package com.example.demo.service;

import com.example.demo.entity.*;
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

    @Autowired
    SemesterService semesterService;

    //check semester //ok
    public void createNewEvaluation(Evaluation evaluation, String studentEmail) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(studentEmail, semesterCurrent.getId());

        Date date = new Date(Calendar.getInstance().getTime().getTime());
        evaluation.setOjt_enrollment(ojt_enrollment);
        evaluation.setTimeCreated(date);
        evaluationRepository.save(evaluation);
    }

    //check semester // ok
    public List<Evaluation> getEvaluationsBySupervisorEmail(String email) {
        List<Evaluation> evaluationList = evaluationRepository.findEvaluationsBySupervisorEmail(email);
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        for (int i = 0; i < evaluationList.size(); i++) {
            if (evaluationList.get(i).getOjt_enrollment().getSemester().getId() != semesterCurrent.getId()) {
                evaluationList.remove(evaluationList.get(i));
            }
        }
        if (evaluationList != null) {
            return evaluationList;
        }
        return null;
    }

    //check semester // ok
    public List<Evaluation> getEvaluationsByStudentEmail(String email) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semesterCurrent.getId());

        List<Evaluation> evaluationList = evaluationRepository.findEvaluationsByOjt_enrollment(ojt_enrollment);
        if (evaluationList != null) {
            return evaluationList;
        }
        return null;
    }

    //check semester // ok
    public int countEvaluation(String email) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semesterCurrent.getId());

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

    //check semester // ok
    public List<Evaluation> getListEvaluationOfBusiness(String email) {
        List<Supervisor> supervisorList = supervisorService.getAllSupervisorOfABusiness(email);//get all supervisor at this semester

        Semester semester = semesterService.getSemesterCurrent();

        List<Evaluation> evaluations = new ArrayList<>();
        for (int i = 0; i < supervisorList.size(); i++) {
            List<Evaluation> list = evaluationRepository.findEvaluationsBySupervisorEmail(supervisorList.get(i).getEmail());
            evaluations.addAll(list);// get all evaluation of a supervisor
        }
        evaluations = checkSemesterOfEvaluation(evaluations, semester.getId());

        if (evaluations != null) {
            return evaluations;
        }
        return null;
    }

    public List<Evaluation> checkSemesterOfEvaluation(List<Evaluation> evaluations, int semesterId) {
        for (int i = 0; i < evaluations.size(); i++) {
            if (evaluations.get(i).getOjt_enrollment().getSemester().getId() != semesterId) {
                evaluations.remove(evaluations.get(i));
            }
        }
        if (evaluations != null) {
            return evaluations;
        }
        return null;
    }

    public boolean updateEvaluation(int id, Evaluation evaluation) {
        Evaluation evaluationFindById = evaluationRepository.findById(id);
        evaluation.setOjt_enrollment(evaluationFindById.getOjt_enrollment());
        evaluation.setSupervisor(evaluationFindById.getSupervisor());
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        evaluation.setTimeCreated(date);
        if (evaluationFindById != null) {
            if (id == evaluation.getId()) {
                evaluationRepository.save(evaluation);
                return true;
            }
        }
        return false;
    }

}
