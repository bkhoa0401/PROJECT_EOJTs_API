package com.example.demo.entity;

import javax.persistence.*;

@Entity
@Table(name = "SpecializedSkills")
public class SpecializedSkills {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "specializedId")
    private int specializedId;

    @Column(name = "skillId")
    private int skillId;

    public int getSpecializedId() {
        return specializedId;
    }

    public void setSpecializedId(int specializedId) {
        this.specializedId = specializedId;
    }

    public int getSkillId() {
        return skillId;
    }

    public void setSkillId(int skillId) {
        this.skillId = skillId;
    }
}
