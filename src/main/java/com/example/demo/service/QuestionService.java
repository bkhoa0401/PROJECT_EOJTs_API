package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.entity.Question;
import com.example.demo.repository.IQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService implements IQuestionService {

    @Autowired
    IQuestionRepository iQuestionRepository;

    @Override
    public List<Question> getAllQuestion() {
        List<Question> questions = iQuestionRepository.findAll();

        for (int i = 0; i < questions.size(); i++) {
            List<Answer> answers = questions.get(i).getAnswers();
            for (int j=0;j<answers.size();j++){
                if(answers.get(j).isOther()==true){
                    answers.remove(answers.get(j));
                }
            }
            questions.get(i).setAnswers(answers);
        }
        if (questions != null) {
            return questions;
        }
        return null;
    }

    @Override
    public Question findQuestionById(int id) {
        Question question=iQuestionRepository.findById(id);
        return question;
    }
}
