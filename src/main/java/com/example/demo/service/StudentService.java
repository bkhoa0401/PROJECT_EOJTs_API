package com.example.demo.service;

import com.example.demo.entity.Skill;
import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public Student getStudentIsInvited(String email) {
        Student student = studentRepository.findByEmail(email);
        if (student != null) {
            return student;
        }
        return null;
    }

    public List<Student> findStudentByBusinessNameOption(String option1, String option2) {
        List<Student> studentList = studentRepository.findStudentByOption1OrOption2(option1, option2);
        if (studentList != null) {
            return studentList;
        }
        return null;
    }

    public boolean updateLinkFileResumeForStudent(String email, String resumeLink) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            if (resumeLink != null) {
                student.setResumeLink(resumeLink);
                studentRepository.save(student);
                return true;
            }
        }
        return false;
    }

    public boolean updateStatusOptionOfStudent(int numberOfOption, boolean statusOfOption, String emailStudent) {
        Student student = getStudentByEmail(emailStudent);
        if (student != null) {
            if (numberOfOption == 1) {
                student.setAcceptedOption1(statusOfOption);
                student.setInterviewed1(true);
                studentRepository.save(student);
                return true;
            }
            if (numberOfOption == 2) {
                student.setAcceptedOption2(statusOfOption);
                student.setInterviewed2(true);
                studentRepository.save(student);
                return true;
            }
        }
        return false;
    }


    public List<Student> getAllStudentByStatusOption(int typeGetStatus) {
        List<Student> studentList;
        if (typeGetStatus == 1) {// get all sv pass  option 1
            studentList = studentRepository.findStudentsByAcceptedOption1TrueAndAcceptedOption2False();
            return studentList;
        } else if (typeGetStatus == 2) {// get all sv pass  option 2
            studentList = studentRepository.findStudentsByAcceptedOption2TrueAndAcceptedOption1False();
            return studentList;
        } else if (typeGetStatus == 3) {// get all sv pass 2 option
            studentList = studentRepository.findStudentsByAcceptedOption1TrueAndAcceptedOption2True();
            return studentList;
        } else if (typeGetStatus == 4) {// get all sv fail 2 option
            studentList = studentRepository.findStudentsByAcceptedOption1FalseAndAcceptedOption2False();
            return studentList;
        }
        return null;
    }

    public boolean updateTokenDeviceForStudent(String emailStudent, String token) {
        Student student = getStudentByEmail(emailStudent);
        if (student != null) {
            student.setToken(token);
            studentRepository.save(student);
            return true;
        }
        return false;
    }

    public boolean updateLinkTranscriptForStudent(Student student) {
        studentRepository.save(student);
        return true;
    }

}
