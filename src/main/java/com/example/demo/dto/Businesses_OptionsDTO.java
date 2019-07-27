package com.example.demo.dto;

import com.example.demo.entity.Business;

import java.util.List;

public class Businesses_OptionsDTO {
    List<Business> businessList;
    List<Integer> countStudentRegisterBusiness;

    public List<Business> getBusinessList() {
        return businessList;
    }

    public void setBusinessList(List<Business> businessList) {
        this.businessList = businessList;
    }

    public List<Integer> getCountStudentRegisterBusiness() {
        return countStudentRegisterBusiness;
    }

    public void setCountStudentRegisterBusiness(List<Integer> countStudentRegisterBusiness) {
        this.countStudentRegisterBusiness = countStudentRegisterBusiness;
    }
}
