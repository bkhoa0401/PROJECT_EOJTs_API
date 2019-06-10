package com.example.demo.service;

import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
@Service
=======
import java.util.List;

@Repository
>>>>>>> master
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

}
