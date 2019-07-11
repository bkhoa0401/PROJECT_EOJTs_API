package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "evaluation")
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "project_name")
    private String project_name;

    @Column(name = "score_discipline")
    private float score_discipline;

    @Column(name = "score_work")
    private float score_work;

    @Column(name = "score_activity")
    private float score_activity;

    @Column(name = "remark", columnDefinition = "NVARCHAR(MAX)")
    private String remark;

//    @Column(name = "student_code")
//    private String student_code;

    @Column(name = "title", columnDefinition = "NVARCHAR(255)")
    private String title;

    @Column(name = "timeCreated")
    private Date timeCreated;

    @ManyToOne
    @JsonIgnore
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "supervisor_email")
    private Supervisor  supervisor;

    @ManyToOne
    @JsonIgnore
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "ojt_enrollment_id")
    private Ojt_Enrollment  ojt_enrollment;

    @Column(name = "timeStart")
    private Date timeStart;

    @Column(name = "timeEnd")
    private Date timeEnd;


    public String getProject_name() {
        return project_name;
    }

    public void setProject_name(String project_name) {
        this.project_name = project_name;
    }

    public float getScore_discipline() {
        return score_discipline;
    }

    public void setScore_discipline(float score_discipline) {
        this.score_discipline = score_discipline;
    }

    public float getScore_work() {
        return score_work;
    }

    public void setScore_work(float score_work) {
        this.score_work = score_work;
    }

    public float getScore_activity() {
        return score_activity;
    }

    public void setScore_activity(float score_activity) {
        this.score_activity = score_activity;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

//    public String getStudent_code() {
//        return student_code;
//    }
//
//    public void setStudent_code(String student_code) {
//        this.student_code = student_code;
//    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(Date timeCreated) {
        this.timeCreated = timeCreated;
    }

    public Supervisor getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Supervisor supervisor) {
        this.supervisor = supervisor;
    }

    public Ojt_Enrollment getOjt_enrollment() {
        return ojt_enrollment;
    }

    public void setOjt_enrollment(Ojt_Enrollment ojt_enrollment) {
        this.ojt_enrollment = ojt_enrollment;
    }

    public Date getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(Date timeStart) {
        this.timeStart = timeStart;
    }

    public Date getTimeEnd() {
        return timeEnd;
    }

    public void setTimeEnd(Date timeEnd) {
        this.timeEnd = timeEnd;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
