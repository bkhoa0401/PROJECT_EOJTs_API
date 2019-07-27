package com.example.demo.entity;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "action_history")
public class HistoryAction implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "email")
    private String email;

    @Column(name = "role")
    private String role;

    @Column(name = "function_type")
    private String function_type;

    @Column(name = "controller")
    private String controller;

    @Column(name = "function_name")
    private String function_name;

    @Column(name = "targetEmail")
    private String targetEmail;

    @Column(name = "actionTime")
    Date actionTime;

    @OneToMany(mappedBy = "historyAction")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<History_Details> details;

    public HistoryAction(String email, String role, String function_type, String controller, String function_name, String targetEmail, Date actionTime, List<History_Details> details) {
        this.email = email;
        this.role = role;
        this.function_type = function_type;
        this.controller = controller;
        this.function_name = function_name;
        this.targetEmail = targetEmail;
        this.actionTime = actionTime;
        this.details = details;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFunction_type() {
        return function_type;
    }

    public void setFunction_type(String function_type) {
        this.function_type = function_type;
    }

    public String getController() {
        return controller;
    }

    public void setController(String controller) {
        this.controller = controller;
    }

    public String getFunction_name() {
        return function_name;
    }

    public void setFunction_name(String function_name) {
        this.function_name = function_name;
    }

    public String getTargetEmail() {
        return targetEmail;
    }

    public void setTargetEmail(String targetEmail) {
        this.targetEmail = targetEmail;
    }

    public Date getActionTime() {
        return actionTime;
    }

    public void setActionTime(Date actionTime) {
        this.actionTime = actionTime;
    }
}