package com.example.demo.service;

import com.example.demo.entity.Skill;
import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    StudentRepository studentRepository;

    public Student getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email);
        return student;
    }

    public boolean saveListStudent(List<Student> studentList) {
        studentRepository.saveAll(studentList);
        return true;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public int getSpecializedIdByEmail(String email) {
        Student student = getStudentByEmail(email);
        int specializedId = student.getSpecialized().getId();

        return specializedId;
    }

    public boolean updateInforStudent(String email, String ojective, float gpa, List<Skill> skillList) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            student.setObjective(ojective);
            student.setGpa(gpa);
            student.setSkills(skillList);
            studentRepository.save(student);
            return true;
        }
        return false;
    }

    public boolean updateOption1Student(String email, String option1) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            if (option1 != null || !option1.isEmpty()) {
                student.setOption1(option1);
            }
            studentRepository.save(student);
            return true;
        }
        return false;
    }

    public boolean updateOption2Student(String email, String option2) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            if (option2 != null || !option2.isEmpty()) {
                student.setOption2(option2);
            }
            studentRepository.save(student);
            return true;
        }
        return false;
    }

    public Student findStudentByInvitationsId(int id) {
        Student student = studentRepository.findStudentByInvitationsId(id);
        if (student != null) {
            return student;
        }
        return null;
    }

    public List<Student> findStudentByBusinessNameOption(String option1,String option2){
        List<Student> studentList=studentRepository.findStudentByOption1OrOption2(option1,option2);
        if (studentList != null) {
            return studentList;
        }
        return null;
    }
}
