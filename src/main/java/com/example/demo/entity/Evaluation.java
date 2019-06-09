package com.example.demo.entity;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;

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

    @Column(name = "student_code")
    private String student_code;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "supervisor_email")
    private Supervisor  supervisor;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "ojt_enrollment_id")
    private Ojt_Enrollment  ojt_enrollment;

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

    public String getStudent_code() {
        return student_code;
    }

    public void setStudent_code(String student_code) {
        this.student_code = student_code;
    }
}
