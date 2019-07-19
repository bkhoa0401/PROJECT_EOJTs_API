package com.example.demo.entity;

import com.fasterxml.jackson.annotation.*;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;
import org.hibernate.search.annotations.TermVector;

import javax.persistence.*;
import javax.xml.crypto.Data;
import java.io.Serializable;
import java.util.List;


//@JsonIgnoreProperties(ignoreUnknown = true, value = {"hibernateLazyInitializer", "handler"})
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property  = "id")

@Entity
@Indexed
@Table(name = "specialized")
public class Specialized implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "name", columnDefinition = "NVARCHAR(100)")
    @Field(termVector = TermVector.YES)
    private String name;

    @OneToMany(mappedBy = "specialized")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Skill> skills;

    @OneToMany(mappedBy = "specialized")
//    @JsonManagedReference
    @JsonIgnore
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Student> students;

    @Column(name = "isActive")
    private Boolean status;

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

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
