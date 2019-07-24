package com.example.demo.repository;

import com.example.demo.entity.Student_Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IStudent_AnswerRepository extends JpaRepository<Student_Answer,Integer> {
}
