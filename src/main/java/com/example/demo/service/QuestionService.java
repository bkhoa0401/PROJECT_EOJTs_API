package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.entity.Question;
import com.example.demo.repository.IQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService implements IQuestionService {

    @Autowired
    IQuestionRepository iQuestionRepository;

    @Override
    public List<Question> getAllQuestion() {
        List<Question> questions = iQuestionRepository.findAll();

        List<Question> questionsResult = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            if (question.isActive()) {
                List<Answer> answers = questions.get(i).getAnswers();
                for (int j = 0; j < answers.size(); j++) {
                    if (answers.get(j).isOther() == true) {
                        answers.remove(answers.get(j));
                    }
                }
                question.setAnswers(answers);
                questionsResult.add(question);
            }

        }
        if (questionsResult != null) {
            return questionsResult;
        }
        return null;
    }

    @Override
    public List<Question> getAllQuestionNotCareStatus() {
        List<Question> questions = iQuestionRepository.findAll();
        if (questions != null) {
            return questions;
        }
        return null;
    }

    @Override
    public Question findQuestionById(int id) {
        Question question = iQuestionRepository.findById(id);
        return question;
    }

    @Override
    public void addNewQuestion(Question question) {
        List<Answer> answers = question.getAnswers();

        for (Answer answer : answers) {
            answer.setQuestion(question);
        }
        question.setAnswers(answers);
        iQuestionRepository.save(question);
    }

    @Override
    public void deleteQuestion(int id, boolean status) {
        Question question = findQuestionById(id);
        if (question != null) {
            question.setActive(status);
            iQuestionRepository.save(question);
        }
    }

    @Override
    public void updateQuestion(Question question) {
        Question questionIsExisted = findQuestionById(question.getId());
        if (questionIsExisted != null) {
            List<Answer> answers = question.getAnswers();

            for (Answer answer : answers) {
                answer.setQuestion(question);
            }
            question.setAnswers(answers);
            iQuestionRepository.save(question);
        }
    }
}
