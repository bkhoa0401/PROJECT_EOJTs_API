package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.entity.Student;
import com.example.demo.entity.Student_Answer;
import com.example.demo.repository.IStudent_AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Student_AnswerService implements IStudent_AnswerService {

    @Autowired
    IStudent_AnswerRepository iStudent_answerRepository;

    @Override
    public void saveStudent_Answer(Student student, List<Answer> answer) {
        Student_Answer student_answer = new Student_Answer();

        for (int i = 0; i < answer.size(); i++) {
            student_answer.setStudent(student);
            student_answer.setAnswer(answer.get(i));
            iStudent_answerRepository.save(student_answer);
            student_answer = new Student_Answer();
        }
    }
}
