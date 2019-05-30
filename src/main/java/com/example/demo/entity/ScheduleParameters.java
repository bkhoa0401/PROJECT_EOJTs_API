/*
 * To change this license header; choose License Headers in Project Properties.
 * To change this template file; choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.demo.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "ScheduleParameters")
public class ScheduleParameters {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "TimeCloseListCompanies")
    private Date timeCloseListCompanies;

    @Column(name = "TimeRegister")
    private Date timeRegister;

    @Column(name = "TimeSendListStudents")
    private Date timeSendListStudents;

    @Column(name = "TimeSendInvitations")
    private Date timeSendInvitations;

    @Column(name = "TimeInterview")
    private Date timeInterview;

    @Column(name = "TimeChooseAspirations")
    private Date timeChooseAspirations;

    @Column(name = "TimeStudentBusiness")
    private Date timeStudentBusiness;

    @Column(name = "TimeStudentsFailAll")
    private Date timeStudentsFailAll;

    @Column(name = "TimeStartOJT")
    private Date timeStartOJT;

    @Column(name = "TimeEndOJT")
    private Date timeEndOJT;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getTimeCloseListCompanies() {
        return timeCloseListCompanies;
    }

    public void setTimeCloseListCompanies(Date timeCloseListCompanies) {
        this.timeCloseListCompanies = timeCloseListCompanies;
    }

    public Date getTimeRegister() {
        return timeRegister;
    }

    public void setTimeRegister(Date timeRegister) {
        this.timeRegister = timeRegister;
    }

    public Date getTimeSendListStudents() {
        return timeSendListStudents;
    }

    public void setTimeSendListStudents(Date timeSendListStudents) {
        this.timeSendListStudents = timeSendListStudents;
    }

    public Date getTimeSendInvitations() {
        return timeSendInvitations;
    }

    public void setTimeSendInvitations(Date timeSendInvitations) {
        this.timeSendInvitations = timeSendInvitations;
    }

    public Date getTimeInterview() {
        return timeInterview;
    }

    public void setTimeInterview(Date timeInterview) {
        this.timeInterview = timeInterview;
    }

    public Date getTimeChooseAspirations() {
        return timeChooseAspirations;
    }

    public void setTimeChooseAspirations(Date timeChooseAspirations) {
        this.timeChooseAspirations = timeChooseAspirations;
    }

    public Date getTimeStudentBusiness() {
        return timeStudentBusiness;
    }

    public void setTimeStudentBusiness(Date timeStudentBusiness) {
        this.timeStudentBusiness = timeStudentBusiness;
    }

    public Date getTimeStudentsFailAll() {
        return timeStudentsFailAll;
    }

    public void setTimeStudentsFailAll(Date timeStudentsFailAll) {
        this.timeStudentsFailAll = timeStudentsFailAll;
    }

    public Date getTimeStartOJT() {
        return timeStartOJT;
    }

    public void setTimeStartOJT(Date timeStartOJT) {
        this.timeStartOJT = timeStartOJT;
    }

    public Date getTimeEndOJT() {
        return timeEndOJT;
    }

    public void setTimeEndOJT(Date timeEndOJT) {
        this.timeEndOJT = timeEndOJT;
    }

}
