package com.example.demo.entity;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "business")
public class Business {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "business_name")
    private String business_name;

    @Column(name = "business_eng_name")
    private String business_eng_name;

    @Column(name = "business_phone")
    private String business_phone;

    @Column(name = "business_address")
    private String business_address;

    @Column(name = "business_overview")
    private String business_overview;

    @Column(name = "business_website")
    private String business_website;

    @Column(name = "logo")
    private String logo;

    @OneToMany(mappedBy = "business")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Ojt_Enrollment> ojt_enrollments;

    public Business() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBusiness_name() {
        return business_name;
    }

    public void setBusiness_name(String business_name) {
        this.business_name = business_name;
    }

    public String getBusiness_eng_name() {
        return business_eng_name;
    }

    public void setBusiness_eng_name(String business_eng_name) {
        this.business_eng_name = business_eng_name;
    }

    public String getBusiness_phone() {
        return business_phone;
    }

    public void setBusiness_phone(String business_phone) {
        this.business_phone = business_phone;
    }

    public String getBusiness_address() {
        return business_address;
    }

    public void setBusiness_address(String business_address) {
        this.business_address = business_address;
    }

    public String getBusiness_overview() {
        return business_overview;
    }

    public void setBusiness_overview(String business_overview) {
        this.business_overview = business_overview;
    }

    public String getBusiness_website() {
        return business_website;
    }

    public void setBusiness_website(String business_website) {
        this.business_website = business_website;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public List<Ojt_Enrollment> getOjt_enrollments() {
        return ojt_enrollments;
    }

    public void setOjt_enrollments(List<Ojt_Enrollment> ojt_enrollments) {
        this.ojt_enrollments = ojt_enrollments;
    }
}
