package com.example.demo.entity;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "supervisor")
public class Supervisor {

    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "name",columnDefinition = "NVARCHAR(150)")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address",columnDefinition = "NVARCHAR(150)")
    private String address;

    @OneToMany(mappedBy = "supervisor")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Task> tasks;

    @OneToMany(mappedBy = "supervisor")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Evaluation> evaluations;

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

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
