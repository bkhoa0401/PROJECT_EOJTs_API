package com.example.demo.repository;

import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task,Integer> {

    List<Task> findTasksBySupervisorEmail(String email);

    @Query(value = "select t from Task t where t.ojt_enrollment=?1")
    List<Task> findTasksByOjt_enrollment(Ojt_Enrollment ojt_enrollmentOfStudent);
}
