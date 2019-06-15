package com.example.demo.repository;

import com.example.demo.entity.Job_Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Job_PostRepository extends JpaRepository<Job_Post,Integer> {
    Job_Post findJob_PostById(int id);
}
