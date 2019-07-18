package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "working_environment ")
    private String working_environment;

    @Column(name = "colleague_support")
    private String colleague_support;

    @Column(name = "tasks_comparison_qualification")
    private String tasks_comparison_qualification;

    @Column(name = "importance_of_ojt")
    private String importance_of_ojt;

    @Column(name = "benefit_of_ojt")
    private String benefit_of_ojt;

    @Column(name = "usefulness_of_knowledge")
    private String usefulness_of_knowledge;

    @Column(name = "feel_about_tasks")
    private String feel_about_tasks;

    @Column(name = "satisfaction_about_business_recommended")
    private String satisfaction_about_business_recommended;

    @Column(name = "reason_not_satisfied")
    private String reason_not_satisfied;

    @Column(name = "others")
    private String others;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "feedback_id")
    private Ojt_Enrollment ojt_enrollment;

    public Feedback() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getWorking_environment() {
        return working_environment;
    }

    public void setWorking_environment(String working_environment) {
        this.working_environment = working_environment;
    }

    public String getColleague_support() {
        return colleague_support;
    }

    public void setColleague_support(String colleague_support) {
        this.colleague_support = colleague_support;
    }

    public String getTasks_comparison_qualification() {
        return tasks_comparison_qualification;
    }

    public void setTasks_comparison_qualification(String tasks_comparison_qualification) {
        this.tasks_comparison_qualification = tasks_comparison_qualification;
    }

    public String getImportance_of_ojt() {
        return importance_of_ojt;
    }

    public void setImportance_of_ojt(String importance_of_ojt) {
        this.importance_of_ojt = importance_of_ojt;
    }

    public String getBenefit_of_ojt() {
        return benefit_of_ojt;
    }

    public void setBenefit_of_ojt(String benefit_of_ojt) {
        this.benefit_of_ojt = benefit_of_ojt;
    }

    public String getUsefulness_of_knowledge() {
        return usefulness_of_knowledge;
    }

    public void setUsefulness_of_knowledge(String usefulness_of_knowledge) {
        this.usefulness_of_knowledge = usefulness_of_knowledge;
    }

    public String getFeel_about_tasks() {
        return feel_about_tasks;
    }

    public void setFeel_about_tasks(String feel_about_tasks) {
        this.feel_about_tasks = feel_about_tasks;
    }

    public String getSatisfaction_about_business_recommended() {
        return satisfaction_about_business_recommended;
    }

    public void setSatisfaction_about_business_recommended(String satisfaction_about_business_recommended) {
        this.satisfaction_about_business_recommended = satisfaction_about_business_recommended;
    }

    public String getReason_not_satisfied() {
        return reason_not_satisfied;
    }

    public void setReason_not_satisfied(String reason_not_satisfied) {
        this.reason_not_satisfied = reason_not_satisfied;
    }

    public String getOthers() {
        return others;
    }

    public void setOthers(String others) {
        this.others = others;
    }

    public Ojt_Enrollment getOjt_enrollment() {
        return ojt_enrollment;
    }

    public void setOjt_enrollment(Ojt_Enrollment ojt_enrollment) {
        this.ojt_enrollment = ojt_enrollment;
    }
}
