package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "skill")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "specialized_id")
    private Specialized specialized;

    @ManyToMany(mappedBy = "skills")
    @JsonBackReference
    private List<Student> students;

    @ManyToMany(mappedBy = "skills")
    @JsonBackReference
    private List<Job_Post> job_posts;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
