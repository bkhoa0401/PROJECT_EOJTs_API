package com.example.demo.entity;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "job_post")
public class Job_Post {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "title",columnDefinition = "NVARCHAR(150)")
    private String title;

    @Column(name = "description",columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "time_post")
    private Date time_post;

    @Column(name = "views")
    private int views;

    @Column(name = "contact",columnDefinition = "NVARCHAR(500)")
    private String contact;

    @Column(name = "interview_process",columnDefinition = "NVARCHAR(500)")
    private String interview_process;

    @Column(name = "interest",columnDefinition = "NVARCHAR(500)")
    private String interest;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "ojt_enrollment")
    private Ojt_Enrollment ojt_enrollment;

    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(
            name = "job_post_skill",
            joinColumns = {
                    @JoinColumn(name = "job_post_id")},
            inverseJoinColumns = {
                    @JoinColumn(name = "skill_id")}
    )
    private List<Skill> skills;

    public Job_Post() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getTime_post() {
        return time_post;
    }

    public void setTime_post(Date time_post) {
        this.time_post = time_post;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getInterview_process() {
        return interview_process;
    }

    public void setInterview_process(String interview_process) {
        this.interview_process = interview_process;
    }

    public String getInterest() {
        return interest;
    }

    public void setInterest(String interest) {
        this.interest = interest;
    }

    public Ojt_Enrollment getOjt_enrollment() {
        return ojt_enrollment;
    }

    public void setOjt_enrollment(Ojt_Enrollment ojt_enrollment) {
        this.ojt_enrollment = ojt_enrollment;
    }
}
