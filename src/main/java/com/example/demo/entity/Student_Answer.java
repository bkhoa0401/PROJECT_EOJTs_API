package com.example.demo.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "student_answer")
public class Student_Answer implements Serializable {

    @EmbeddedId
    private StudentAnswerID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("student_email")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("answer_id")
    private Answer answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "other")
    private Question other;


    public Student_Answer() {
    }

    public StudentAnswerID getId() {
        return id;
    }

    public void setId(StudentAnswerID id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Answer getAnswer() {
        return answer;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    public Question getOther() {
        return other;
    }

    public void setOther(Question other) {
        this.other = other;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass())
            return false;

        Student_Answer that = (Student_Answer) o;
        return Objects.equals(student, that.student) &&
                Objects.equals(answer, that.answer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(student, answer);
    }
}
