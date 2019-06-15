package com.example.demo.service;

import com.example.demo.entity.Invitation;
import com.example.demo.repository.InvitationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvitationService {
    @Autowired
    InvitationRepository invitationRepository;

    public List<Invitation> getListInvitationByStudentEmail(String email){
        return invitationRepository.findInvitationByStudentsEmail(email);
    }

    public List<Invitation> getListInvitationByBusinessEmail(String email){
        return invitationRepository.findInvitationByBusinessEmail(email);
    }

    public Invitation getInvitationById(int id){
        return invitationRepository.findInvitationById(id);
    }

    public Invitation getInvitationByBusinessEmailAndStudentEmail(String businessEmail,String studentEmail){
        return invitationRepository.findInvitationByBusinessEmailAndStudentsEmail(businessEmail,studentEmail);
    }
}
