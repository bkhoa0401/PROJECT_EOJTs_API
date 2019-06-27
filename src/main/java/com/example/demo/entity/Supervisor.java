package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "supervisor")
public class Supervisor {

    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "name",columnDefinition = "NVARCHAR(150)")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address",columnDefinition = "NVARCHAR(150)")
    private String address;

    @OneToMany(mappedBy = "supervisor")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Task> tasks;

    @OneToMany(mappedBy = "supervisor")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Evaluation> evaluations;

    @OneToMany(mappedBy = "supervisor")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Student> students;

    @ManyToOne
    @JsonIgnore
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "ojt_enrollment_id")
    private Ojt_Enrollment ojt_enrollment;

    @Column(name = "isActive")
    private boolean isActive;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public List<Evaluation> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(List<Evaluation> evaluations) {
        this.evaluations = evaluations;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    public Ojt_Enrollment getOjt_enrollment() {
        return ojt_enrollment;
    }

    public void setOjt_enrollment(Ojt_Enrollment ojt_enrollment) {
        this.ojt_enrollment = ojt_enrollment;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
