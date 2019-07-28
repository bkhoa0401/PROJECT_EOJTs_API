package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.repository.IAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerService implements IAnswerService {

    @Autowired
    IAnswerRepository iAnswerRepository;

    @Override
    public void saveAnswer(Answer answer) {
        iAnswerRepository.save(answer);
    }

    @Override
    public List<Answer> findAnswerByOtherIsTrueAndQuestionId(int id) {
        List<Answer> answers = iAnswerRepository.findAnswersByOtherIsTrueAndQuestionId(id);
        return answers;
    }
}
