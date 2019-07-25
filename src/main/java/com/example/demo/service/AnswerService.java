package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.repository.IAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnswerService implements IAnswerService {

    @Autowired
    IAnswerRepository iAnswerRepository;

    @Override
    public void saveAnswer(Answer answer) {
        iAnswerRepository.save(answer);
    }
}
