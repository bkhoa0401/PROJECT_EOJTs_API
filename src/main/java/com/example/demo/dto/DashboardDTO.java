package com.example.demo.dto;

import com.example.demo.entity.Business;

public class DashboardDTO {
    private float percentTaskDone;
    private int countEvaluation;
    private int informMessageIsNotRead;
    private Business business;

    public float getPercentTaskDone() {
        return percentTaskDone;
    }

    public void setPercentTaskDone(float percentTaskDone) {
        this.percentTaskDone = percentTaskDone;
    }

    public int getCountEvaluation() {
        return countEvaluation;
    }

    public void setCountEvaluation(int countEvaluation) {
        this.countEvaluation = countEvaluation;
    }

    public int getInformMessageIsNotRead() {
        return informMessageIsNotRead;
    }

    public void setInformMessageIsNotRead(int informMessageIsNotRead) {
        this.informMessageIsNotRead = informMessageIsNotRead;
    }

    public DashboardDTO(float percentTaskDone, int countEvaluation, int informMessageIsNotRead) {
        this.percentTaskDone = percentTaskDone;
        this.countEvaluation = countEvaluation;
        this.informMessageIsNotRead = informMessageIsNotRead;
    }

    public DashboardDTO() {
    }

    public DashboardDTO(float percentTaskDone, int countEvaluation, int informMessageIsNotRead, Business business) {
        this.percentTaskDone = percentTaskDone;
        this.countEvaluation = countEvaluation;
        this.informMessageIsNotRead = informMessageIsNotRead;
        this.business = business;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }
}
