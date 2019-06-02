package com.example.demo.entity;

import javax.persistence.*;

@Entity
@Table(name = "type_of_skills")
public class TypeOfSkills {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "type")
    private String type;

}
