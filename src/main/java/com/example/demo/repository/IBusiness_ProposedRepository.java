package com.example.demo.repository;

import com.example.demo.entity.Business_Proposed;
import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBusiness_ProposedRepository extends JpaRepository<Business_Proposed, Integer> {
    Business_Proposed findById(int id);

    List<Business_Proposed> findBusiness_ProposedsByStudent_proposed(Student student);
}
