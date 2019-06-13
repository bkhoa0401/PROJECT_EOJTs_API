package com.example.demo.repository;

import com.example.demo.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Integer> {
    List<Invitation> findInvitationByStudentsEmail(String email);
}
