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

    public List<Evaluation> getEvaluationListOfStudentList(List<Student> studentList) {
        List<Evaluation> evaluationList = new ArrayList<Evaluation>();
        for (int i = 0; i < studentList.size(); i++) {
            evaluationList.addAll(getEvaluationsByStudentEmail(studentList.get(i).getEmail()));
        }

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
                    overviewEvaluationList.set(i, null);
                }
            }
        }
        if (!overviewEvaluationList.isEmpty()) {
            return overviewEvaluationList;
        }
        return null;
    }

}
