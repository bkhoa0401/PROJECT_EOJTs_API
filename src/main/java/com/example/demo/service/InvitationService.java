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

    public List<Invitation> getListInvitationByStuddentEmail(String email){
        return invitationRepository.findInvitationByStudentsEmail(email);
    }

    public List<Invitation> getListBusinessByStuddentEmail(String email){
        return invitationRepository.findInvitationByBusinessEmail(email);
    }

}
