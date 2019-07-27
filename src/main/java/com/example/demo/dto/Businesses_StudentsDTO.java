package com.example.demo.dto;

import com.example.demo.entity.Business;

import java.util.List;

public class Businesses_StudentsDTO {
    private List<Business> businessList;
    private List<Integer> numberOfStudentInternAtBusiness;

    public List<Business> getBusinessList() {
        return businessList;
    }

    public void setBusinessList(List<Business> businessList) {
        this.businessList = businessList;
    }

    public List<Integer> getNumberOfStudentInternAtBusiness() {
        return numberOfStudentInternAtBusiness;
    }

    public void setNumberOfStudentInternAtBusiness(List<Integer> numberOfStudentInternAtBusiness) {
        this.numberOfStudentInternAtBusiness = numberOfStudentInternAtBusiness;
    }
}
