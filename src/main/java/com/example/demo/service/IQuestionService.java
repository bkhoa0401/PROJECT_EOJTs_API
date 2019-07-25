package com.example.demo.service;

import com.example.demo.entity.Question;

import java.util.List;

public interface IQuestionService {
    List<Question> getAllQuestion();
    Question findQuestionById(int id);
}
