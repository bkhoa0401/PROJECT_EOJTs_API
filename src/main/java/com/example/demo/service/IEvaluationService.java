package com.example.demo.service;

import com.example.demo.entity.Evaluation;
import com.example.demo.entity.Student;

import java.util.List;

public interface IEvaluationService {

    void createNewEvaluation(Evaluation evaluation, String studentEmail);

    List<Evaluation> getEvaluationsBySupervisorEmail(String email);

    List<Evaluation> getEvaluationsByStudentEmail(String email);

    int countEvaluation(String email);

    Evaluation getEvaluationById(int id);

    List<Evaluation> getListEvaluationOfBusiness(String email);

    List<Evaluation> checkSemesterOfEvaluation(List<Evaluation> evaluations, int semesterId);

    boolean updateEvaluation(int id, Evaluation evaluation);

    List<Evaluation> getEvaluationListOfStudentList(List<Student> studentList);
}
