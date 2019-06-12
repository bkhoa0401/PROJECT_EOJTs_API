package com.example.demo.dto;

import com.example.demo.entity.Skill;

public class SkillDTO {
   private Skill skill;
   private int number;

    public SkillDTO(Skill skill, int number) {
        this.skill = skill;
        this.number = number;
    }

    public SkillDTO() {
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}

