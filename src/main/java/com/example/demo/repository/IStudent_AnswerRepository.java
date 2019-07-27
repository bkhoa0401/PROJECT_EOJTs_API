package com.example.demo.repository;

import com.example.demo.entity.Student_Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IStudent_AnswerRepository extends JpaRepository<Student_Answer, Integer> {
    @Query(value = "select top 1* from Student_Answer sa where sa.student_email=?1", nativeQuery = true)
    Student_Answer findByStudentEmail(String email);
    int countStudent_AnswersByAnswerId (int id);
}
