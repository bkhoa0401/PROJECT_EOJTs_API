package com.example.demo.entity;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "Student")
public class Student implements Serializable{

    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "name")
    private String name;

    @Column(name = "specialized")
    private String specialized;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "objective")
    private String objective;

    @Column(name = "option1")
    private String option1;

    @Column(name = "option2")
    private String option2;

    @Column(name = "isAcceptedOption1")
    private boolean isAcceptedOption1;

    @Column(name = "isAcceptedOption2")
    private boolean isAcceptedOption2;

    @Column(name = "code")
    private String code;

    @Column(name = "semester")
    private int semester;

    @Column(name = "token")
    private String token;

    @OneToMany(mappedBy = "student")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Ojt_Enrollment> ojt_enrollments;

    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(
            name = "student_skill",
            joinColumns = {
                    @JoinColumn(name = "student_email")},
            inverseJoinColumns = {
                    @JoinColumn(name = "skill_id")}
    )
    private List<Skill> skills;

    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(
            name = "student_event",
            joinColumns = {
                    @JoinColumn(name = "student_email")},
            inverseJoinColumns = {
                    @JoinColumn(name = "event_id")}
    )
    private List<Event> events;

    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(
            name = "student_invitation",
            joinColumns = {
                    @JoinColumn(name = "student_email")},
            inverseJoinColumns = {
                    @JoinColumn(name = "invitation_id")}
    )
    private List<Invitation> invitations;

    public Student() {
    }

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

    public String getSpecialized() {
        return specialized;
    }

    public void setSpecialized(String specialized) {
        this.specialized = specialized;
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

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public String getOption1() {
        return option1;
    }

    public void setOption1(String option1) {
        this.option1 = option1;
    }

    public String getOption2() {
        return option2;
    }

    public void setOption2(String option2) {
        this.option2 = option2;
    }

    public boolean isAcceptedOption1() {
        return isAcceptedOption1;
    }

    public void setAcceptedOption1(boolean acceptedOption1) {
        isAcceptedOption1 = acceptedOption1;
    }

    public boolean isAcceptedOption2() {
        return isAcceptedOption2;
    }

    public void setAcceptedOption2(boolean acceptedOption2) {
        isAcceptedOption2 = acceptedOption2;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<Ojt_Enrollment> getOjt_enrollments() {
        return ojt_enrollments;
    }

    public void setOjt_enrollments(List<Ojt_Enrollment> ojt_enrollments) {
        this.ojt_enrollments = ojt_enrollments;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    public List<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<Invitation> invitations) {
        this.invitations = invitations;
    }
}
