package com.example.demo.repository;

import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupervisorRepository extends JpaRepository<Supervisor,String> {

    @Query(value = "select s from Supervisor s where s.ojt_enrollment=?1")
    List<Supervisor> findSupervisorsByOjt_enrollment(Ojt_Enrollment ojt_enrollment);

    Supervisor findByEmail(String email);
}
