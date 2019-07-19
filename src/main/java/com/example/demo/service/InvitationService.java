package com.example.demo.service;

import com.example.demo.entity.Invitation;
import com.example.demo.entity.Semester;
import com.example.demo.repository.InvitationRepository;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class InvitationService {
    @Autowired
    InvitationRepository invitationRepository;

    @Autowired
    SemesterService semesterService;

    public List<Invitation> getListInvitationByStudentEmail(String email) {
        Semester semester = semesterService.getSemesterCurrent();

        List<Invitation> invitationList =
                invitationRepository.findInvitationByStudentEmailOrderByTimeCreatedDesc(email);
        List<Invitation> invitationListCurrentSemester = new ArrayList<>();
        for (int i = 0; i < invitationList.size(); i++) {
            Invitation invitation = invitationList.get(i);
            if(invitation.getSemester().getId()== semester.getId()){
                invitationListCurrentSemester.add(invitation);
            }
        }
        return invitationListCurrentSemester;
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
        Semester semester = semesterService.getSemesterCurrent();

        Date date = new Date(Calendar.getInstance().getTime().getTime());
        invitation.setSemester(semester);
        invitation.setTimeCreated(date);
        invitationRepository.save(invitation);
    }

    //check semester //ok
    public Invitation getInvitationByBusinessEmailAndStudentEmail(String businessEmail, String studentEmail) {
        Semester semester = semesterService.getSemesterCurrent();

        Invitation invitation = invitationRepository.findInvitationByBusinessEmailAndStudentEmailAndSemester(businessEmail, studentEmail,semester);
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
