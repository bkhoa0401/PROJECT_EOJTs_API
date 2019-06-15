package com.example.demo.repository;

import com.example.demo.entity.Invitation;
import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Integer> {
   List<Invitation> findInvitationByStudentEmail(String email);

    List<Invitation> findInvitationByBusinessEmail(String email);

    Invitation findInvitationById(int id);

}
