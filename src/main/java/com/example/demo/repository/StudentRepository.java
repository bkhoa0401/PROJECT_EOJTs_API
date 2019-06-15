package com.example.demo.repository;

import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.persistence.Entity;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    Student findByEmail(String email);

    Student findStudentByInvitationsId(int id);

    List<Student> findStudentByOption1OrOption2(String option1,String option2);

    
}
