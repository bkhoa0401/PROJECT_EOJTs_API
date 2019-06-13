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
        Student student = studentRepository.findByEmail(email);
        int specializedId = student.getSpecialized().getId();

        return specializedId;
    }

    public boolean updateInforStudent(String email,String ojective, float gpa, List<Skill> skillList) {
        Student student=studentRepository.findByEmail(email);
        if(student!=null){
            student.setObjective(ojective);
            student.setGpa(gpa);
            student.setSkills(skillList);
            studentRepository.save(student);
            return true;
        }
        return false;
    }

}
