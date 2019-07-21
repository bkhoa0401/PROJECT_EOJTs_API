package com.example.demo.repository;

import com.example.demo.entity.Business_Proposed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IBusiness_ProposedRepository extends JpaRepository<Business_Proposed, Integer> {
    Business_Proposed findById(int id);
}
