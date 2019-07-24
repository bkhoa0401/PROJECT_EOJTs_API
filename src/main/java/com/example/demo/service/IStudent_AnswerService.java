package com.example.demo.service;


import com.example.demo.entity.Answer;
import com.example.demo.entity.Student;

import java.util.List;
import java.util.Map;

public interface IStudent_AnswerService {
    void saveStudent_Answer(Student student, List<Answer> answer, Map<String,String> mapsOther);
}
