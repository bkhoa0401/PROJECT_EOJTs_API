package com.example.demo.service;

import com.example.demo.entity.Invitation;
import com.example.demo.repository.InvitationRepository;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;

@Service
public class InvitationService {
    @Autowired
    InvitationRepository invitationRepository;

    public List<Invitation> getListInvitationByStudentEmail(String email) {
        return invitationRepository.findInvitationByStudentEmailOrderByTimeCreatedDesc(email);
    }

    public List<Invitation> getListInvitationByBusinessEmail(String email) {
        return invitationRepository.findInvitationByBusinessEmailOrderByTimeCreatedDesc(email);
    }

    public Invitation getInvitationById(int id) {
        Invitation invitation = invitationRepository.findInvitationById(id);
        invitation.setRead(true);

        invitationRepository.save(invitation);
        return invitation;
    }

    public void createInvitation(Invitation invitation) {
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        invitation.setTimeCreated(date);
        invitationRepository.save(invitation);
    }

    public Invitation getInvitationByBusinessEmailAndStudentEmail(String businessEmail, String studentEmail) {
        Invitation invitation = invitationRepository.findInvitationByBusinessEmailAndStudentEmail(businessEmail, studentEmail);
        if (invitation != null) {
            return invitation;
        }
        return null;
    }

    public boolean updateStateOfInvitation(int id) {
        Invitation invitation = invitationRepository.findInvitationById(id);
        if (invitation != null) {
            invitation.setState(true);
            invitationRepository.save(invitation);
            return true;
        }
        return false;
    }


}
