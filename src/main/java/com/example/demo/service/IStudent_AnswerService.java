package com.example.demo.service;


import com.example.demo.entity.Answer;
import com.example.demo.entity.Student;

import java.util.List;

public interface IStudent_AnswerService {
    void saveStudent_Answer(Student student, List<Answer> answer);
}
