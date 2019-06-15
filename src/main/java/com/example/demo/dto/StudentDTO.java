package com.example.demo.dto;

import com.example.demo.entity.Student;

public class StudentDTO {
    private String email;
    private String name;
    private String specialized;
    private String phone;
    private String address;
    private String objective;
    private String option1;
    private String option2;
    private boolean isAcceptedOption1;
    private boolean isAcceptedOption2;
    private String code;
    private String token;
    private String avatarLink;
    private float gpa;

    public StudentDTO(String email, String name, String specialized, String phone, String address, String objective, String option1, String option2, boolean isAcceptedOption1, boolean isAcceptedOption2, String code, String token, String avatarLink, float gpa) {
        this.email = email;
        this.name = name;
        this.specialized = specialized;
        this.phone = phone;
        this.address = address;
        this.objective = objective;
        this.option1 = option1;
        this.option2 = option2;
        this.isAcceptedOption1 = isAcceptedOption1;
        this.isAcceptedOption2 = isAcceptedOption2;
        this.code = code;
        this.avatarLink = avatarLink;
        this.gpa = gpa;
    }

    public StudentDTO() {
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getAvatarLink() {
        return avatarLink;
    }

    public void setAvatarLink(String avatarLink) {
        this.avatarLink = avatarLink;
    }

    public float getGpa() {
        return gpa;
    }

    public void setGpa(float gpa) {
        this.gpa = gpa;
    }

    public void convertFromStudentEntity(Student student) {
        this.email = student.getEmail();
        this.name = student.getName();
        this.address = student.getAddress();
        this.code = student.getCode();
        this.gpa = student.getGpa();
        this.specialized = student.getSpecialized().getName();
        this.option1 = student.getOption1();
        this.option2 = student.getOption2();
        this.isAcceptedOption1 = student.isAcceptedOption1();
        this.isAcceptedOption2 = student.isAcceptedOption2();
        this.phone = student.getPhone();
        this.avatarLink = student.getAvatarLink();
    }
}
