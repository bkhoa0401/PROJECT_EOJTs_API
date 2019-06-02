package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "skills")
public class Skills {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "type_skills_id", nullable = false)
    @JsonIgnore
    private TypeOfSkills typeOfSkills;

    @ManyToMany(mappedBy = "skills")
    @JsonIgnore
    private Set<Account> account =new HashSet<>();


    @ManyToMany(mappedBy = "skills")
    @JsonIgnore
    private Set<HiringRequest> hiringRequests =new HashSet<>();

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TypeOfSkills getTypeOfSkills() {
        return typeOfSkills;
    }

    public void setTypeOfSkills(TypeOfSkills typeOfSkills) {
        this.typeOfSkills = typeOfSkills;
    }

    public Set<Account> getAccount() {
        return account;
    }

    public void setAccount(Set<Account> account) {
        this.account = account;
    }

    public Set<HiringRequest> getHiringRequests() {
        return hiringRequests;
    }

    public void setHiringRequests(Set<HiringRequest> hiringRequests) {
        this.hiringRequests = hiringRequests;
    }
}
