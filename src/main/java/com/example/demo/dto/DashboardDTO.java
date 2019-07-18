package com.example.demo.dto;

import com.example.demo.entity.Business;
import com.example.demo.entity.Evaluation;
import com.example.demo.entity.Task;

import java.util.List;

public class DashboardDTO {
    private List<Task> taskList;
    private List<Evaluation> evaluationList;
    private int unReadInformessage;

    public DashboardDTO() {
    }

    public DashboardDTO(List<Task> taskList, List<Evaluation> evaluationList, int unReadInformessage) {
        this.taskList = taskList;
        this.evaluationList = evaluationList;
        this.unReadInformessage = unReadInformessage;
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
}
