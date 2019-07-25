package com.example.demo.dto;

import com.example.demo.entity.Business;
import com.example.demo.entity.Evaluation;
import com.example.demo.entity.Task;

import java.util.List;

public class DashboardDTO {
    private List<Task> taskList;
    private List<Evaluation> evaluationList;
    private int unReadInformessage;
    private boolean isMakeFeedback;
    private boolean isDoneFeedback;


    public DashboardDTO() {
        isDoneFeedback=false;
    }

    public DashboardDTO(List<Task> taskList, List<Evaluation> evaluationList, int unReadInformessage, boolean isMakeFeedback) {
        this.taskList = taskList;
        this.evaluationList = evaluationList;
        this.unReadInformessage = unReadInformessage;
        this.isMakeFeedback = isMakeFeedback;
    }

    public List<Task> getTaskList() {
        return taskList;
    }

    public void setTaskList(List<Task> taskList) {
        this.taskList = taskList;
    }

    public List<Evaluation> getEvaluationList() {
        return evaluationList;
    }

    public void setEvaluationList(List<Evaluation> evaluationList) {
        this.evaluationList = evaluationList;
    }

    public int getUnReadInformessage() {
        return unReadInformessage;
    }

    public void setUnReadInformessage(int unReadInformessage) {
        this.unReadInformessage = unReadInformessage;
    }

    public boolean isMakeFeedback() {
        return isMakeFeedback;
    }

    public void setMakeFeedback(boolean makeFeedback) {
        isMakeFeedback = makeFeedback;
    }

    public boolean isDoneFeedback() {
        return isDoneFeedback;
    }

    public void setDoneFeedback(boolean doneFeedback) {
        isDoneFeedback = doneFeedback;
    }
}
