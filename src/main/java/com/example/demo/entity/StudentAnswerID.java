package com.example.demo.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class StudentAnswerID implements Serializable {

    @Column(name = "student_email")
    private String student_email;

    @Column(name = "answer_id")
    private int answer_id;

    public StudentAnswerID() {
    }

    public StudentAnswerID(String student_email, int answer_id) {
        this.student_email = student_email;
        this.answer_id = answer_id;
    }

    public String getStudent_email() {
        return student_email;
    }

    public void setStudent_email(String student_email) {
        this.student_email = student_email;
    }

    public int getAnswer_id() {
        return answer_id;
    }

    public void setAnswer_id(int answer_id) {
        this.answer_id = answer_id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass())
            return false;

        StudentAnswerID that = (StudentAnswerID) o;
        return Objects.equals(student_email, that.student_email) &&
                Objects.equals(answer_id, that.answer_id);
    }

    @Override
    public int hashCode() {
        int result = student_email.hashCode();
        result = 31 * result + answer_id;
        return result;
    }


}
