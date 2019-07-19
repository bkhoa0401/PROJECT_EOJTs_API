package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "question")
public class Question implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "content", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "has_others")
    private boolean has_others;

    @OneToMany(mappedBy = "question")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Answer> answers;

    @OneToMany(mappedBy = "other")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Student_Answer> student_answers;


    public Question() {
    }

    public Question(String content, boolean has_others, List<Answer> answers, List<Student_Answer> student_answers) {
        this.content = content;
        this.has_others = has_others;
        this.answers = answers;
        this.student_answers = student_answers;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isHas_others() {
        return has_others;
    }

    public void setHas_others(boolean has_others) {
        this.has_others = has_others;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public List<Student_Answer> getStudent_answers() {
        return student_answers;
    }

    public void setStudent_answers(List<Student_Answer> student_answers) {
        this.student_answers = student_answers;
    }
}
