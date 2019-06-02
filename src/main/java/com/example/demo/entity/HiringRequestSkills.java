package com.example.demo.entity;

import javax.persistence.*;

@Entity
@Table(name = "HiringRequestSkills")
public class HiringRequestSkills {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "hiringRequestId")
    private int hiringRequestId;

    @Column(name = "skillId")
    private int skillId;

    @Column(name = "number")
    private int number;

    public int getHiringRequestId() {
        return hiringRequestId;
    }

    public void setHiringRequestId(int hiringRequestId) {
        this.hiringRequestId = hiringRequestId;
    }

    public int getSkillId() {
        return skillId;
    }

    public void setSkillId(int skillId) {
        this.skillId = skillId;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}
