package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.IBusinessRepository;
import com.example.demo.repository.IEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class EvaluationService implements IEvaluationService {
    @Autowired
    IEvaluationRepository IEvaluationRepository;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IBusinessRepository IBusinessRepository;

    @Autowired
    ISupervisorService supervisorService;

    @Autowired
    ISemesterService semesterService;

    //check semester //ok
    @Override
    public void createNewEvaluation(Evaluation evaluation, String studentEmail) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(studentEmail, semesterCurrent.getId());

        Date date = new Date(Calendar.getInstance().getTime().getTime());
        evaluation.setOjt_enrollment(ojt_enrollment);
        evaluation.setTimeCreated(date);
        IEvaluationRepository.save(evaluation);
    }

    //check semester // ok
    @Override
    public List<Evaluation> getEvaluationsBySupervisorEmail(String email) {
        List<Evaluation> evaluationList = IEvaluationRepository.findEvaluationsBySupervisorEmail(email);
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
    @Override
    public List<Evaluation> getEvaluationsByStudentEmail(String email) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semesterCurrent.getId());

        List<Evaluation> evaluationList = IEvaluationRepository.findEvaluationsByOjt_enrollment(ojt_enrollment);
        if (evaluationList != null) {
            return evaluationList;
        }
        return null;
    }

    //check semester // ok
    @Override
    public int countEvaluation(String email) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semesterCurrent.getId());

        int count = IEvaluationRepository.countEvaluationByOjt_enrollment(ojt_enrollment);

        return count;
    }

    @Override
    public Evaluation getEvaluationById(int id) {
        Evaluation evaluation = IEvaluationRepository.findById(id);
        if (evaluation != null) {
            return evaluation;
        }
        return null;
    }

    //check semester // ok
    @Override
    public List<Evaluation> getListEvaluationOfBusiness(String email) {
        List<Supervisor> supervisorList = supervisorService.getAllSupervisorOfABusiness(email);//get all supervisor at this semester

        Semester semester = semesterService.getSemesterCurrent();

        List<Evaluation> evaluations = new ArrayList<>();
        for (int i = 0; i < supervisorList.size(); i++) {
            List<Evaluation> list = IEvaluationRepository.findEvaluationsBySupervisorEmail(supervisorList.get(i).getEmail());
            evaluations.addAll(list);// get all evaluation of a supervisor
        }
        evaluations = checkSemesterOfEvaluation(evaluations, semester.getId());

        if (evaluations != null) {
            return evaluations;
        }
        return null;
    }

    @Override
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

    @Override
    public boolean updateEvaluation(int id, Evaluation evaluation) {
        Evaluation evaluationFindById = IEvaluationRepository.findById(id);
        evaluation.setOjt_enrollment(evaluationFindById.getOjt_enrollment());
        evaluation.setSupervisor(evaluationFindById.getSupervisor());
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        evaluation.setTimeCreated(date);
        if (evaluationFindById != null) {
            if (id == evaluation.getId()) {
                IEvaluationRepository.save(evaluation);
                return true;
            }
        }
        return false;
    }
}
