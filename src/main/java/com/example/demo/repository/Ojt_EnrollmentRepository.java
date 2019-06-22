package com.example.demo.repository;

import com.example.demo.entity.Business;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Ojt_EnrollmentRepository extends JpaRepository<Ojt_Enrollment, Integer> {

    Ojt_Enrollment getOjt_EnrollmentByBusiness_Email(String email);

    Ojt_Enrollment getOjt_EnrollmentByStudentEmail(String email);

    List<Ojt_Enrollment> getOjt_EnrollmentsByBusiness_Email(String email);

}
