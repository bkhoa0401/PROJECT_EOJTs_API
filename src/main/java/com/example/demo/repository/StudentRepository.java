package com.example.demo.repository;

import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.persistence.Entity;


public interface StudentRepository extends JpaRepository<Student, String> {
    Student findByEmail(String email);
}
