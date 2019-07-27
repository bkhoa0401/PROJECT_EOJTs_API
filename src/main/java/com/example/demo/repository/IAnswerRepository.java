package com.example.demo.repository;

import com.example.demo.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAnswerRepository extends JpaRepository<Answer,Integer> {

    @Query(value = "select a from Answer a where a.isOther=true and a.question.id=?1")
    List<Answer> findAnswersByOtherIsTrueAndQuestionId(int id);
}
