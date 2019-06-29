package com.example.demo.service;

import com.example.demo.entity.Job_Post;
import com.example.demo.entity.Skill;
import com.example.demo.entity.Student;
import com.example.demo.entity.Supervisor;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.SupervisorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Service
public class StudentService {
    @Autowired
    StudentRepository studentRepository;

    @Autowired
    SupervisorRepository supervisorRepository;

    @Autowired
    Job_PostService job_postService;

    @Autowired
    SkillService skillService;

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

    public boolean assignSupervisorForStudent(List<Student> studentList) {
        if (studentList.size() != 0) {
            studentRepository.saveAll(studentList);
            return true;
        }
        return false;
    }

    public List<Job_Post> getSuggestListJobPost(String emailStudent) {
        Student student = studentRepository.findByEmail(emailStudent);
        List<Job_Post> job_postListSuggest = new ArrayList<>();
        List<Skill> skillListOfJobPost;

        List<Skill> skillListStudent = student.getSkills();

        List<Job_Post> job_postList = job_postService.getAllJobPost();

        for (int i = 0; i < job_postList.size(); i++) {

            Job_Post job_post = job_postList.get(i);

            skillListOfJobPost = skillService.getListSkillJobPost(job_post);

            float result = compareSkillsStudentAndSkillsJobPost(skillListStudent, skillListOfJobPost);
            if (result >= 0.5) {
                job_postListSuggest.add(job_postList.get(i));
            }
        }
        return job_postListSuggest;
    }

    public float compareSkillsStudentAndSkillsJobPost(List<Skill> skillListStudent, List<Skill> skillListJobPost) {
        int similar = 0;
        for (int i = 0; i < skillListStudent.size(); i++) {
            Skill studentSkill = skillListStudent.get(i);
            for (int j = 0; j < skillListJobPost.size(); j++) {
                Skill jobPostSkill = skillListJobPost.get(j);
                if (studentSkill.getName().equals(jobPostSkill.getName())) {
                    similar = similar + 1;
                }
            }
        }

        float indexSimilarAndStudentSkills = (float) similar / (float) skillListStudent.size();
        float indexSimilarAndJobPostSkills = (float) similar / (float) skillListJobPost.size();

        float result = (indexSimilarAndStudentSkills + indexSimilarAndJobPostSkills) / 2;

        return result;
    }
}
