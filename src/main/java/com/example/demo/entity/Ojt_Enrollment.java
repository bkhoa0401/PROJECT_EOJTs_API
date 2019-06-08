package com.example.demo.entity;


import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "ojt_enrollment")
public class Ojt_Enrollment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "semester_id")
    private int semester_id;

    @Column(name = "job_post_id")
    private int job_post_id;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "student_email")
    private Student student;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "business_email")
    private Business business;

    @OneToMany(mappedBy = "ojt_enrollment")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Job_Post> job_posts;

    public Ojt_Enrollment() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSemester_id() {
        return semester_id;
    }

    public void setSemester_id(int semester_id) {
        this.semester_id = semester_id;
    }

    public int getJob_post_id() {
        return job_post_id;
    }

    public void setJob_post_id(int job_post_id) {
        this.job_post_id = job_post_id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public List<Job_Post> getJob_posts() {
        return job_posts;
    }

    public void setJob_posts(List<Job_Post> job_posts) {
        this.job_posts = job_posts;
    }
}
