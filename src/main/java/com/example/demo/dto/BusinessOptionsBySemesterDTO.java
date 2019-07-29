package com.example.demo.dto;

import java.io.Serializable;
import java.util.List;

public class BusinessOptionsBySemesterDTO implements Serializable {
    private String semester;
    private List<Integer> countStudentRegisterBusiness;

    public BusinessOptionsBySemesterDTO() {
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public List<Integer> getCountStudentRegisterBusiness() {
        return countStudentRegisterBusiness;
    }

    public void setCountStudentRegisterBusiness(List<Integer> countStudentRegisterBusiness) {
        this.countStudentRegisterBusiness = countStudentRegisterBusiness;
    }
}
