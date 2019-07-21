package com.example.demo.service;

import com.example.demo.entity.*;

import java.text.ParseException;
import java.util.List;

public interface IStudentService {

    public Student getStudentByEmail(String email);

    public boolean saveListStudent(List<Student> studentList);

    public boolean saveStudent(Student student);

    public List<Student> getAllStudents();

    public List<Student> getAllStudentsBySemesterId();

    public int getSpecializedIdByEmail(String email);

    public boolean updateInforStudent(String email, String ojective, List<Skill> skillList);

    public boolean updateOption1Student(String email, String option1);

    public boolean updateOption2Student(String email, String option2);

    public Student getStudentIsInvited(String email);

    public List<Student> findStudentByBusinessNameOption(String option1, String option2);

    public boolean updateLinkFileResumeForStudent(String email, String resumeLink);

    public boolean updateStatusOptionOfStudent(List<Integer> numberOfOption, boolean statusOfOption, String emailStudent);

    public List<Student> getAllStudentByStatusOption(int typeGetStatus);

    public boolean updateTokenDeviceForStudent(String emailStudent, String token);

    public boolean updateLinkTranscriptForStudent(Student student);

    public boolean assignSupervisorForStudent(List<Student> studentList);

    public List<Job_Post> getSuggestListJobPost(String emailStudent);

    public float compareSkillsStudentAndSkillsJobPost(List<Skill> skillListStudent, List<Skill> skillListJobPost);

    public boolean updateLinkAvatar(String emailStudent, String linkAvatar);

    public Business getBusinessOfStudent(String studentEmail);

    public List<Business> getBusinessByOptionStudent(String studentEmail);

    public List<Student> getAllStudentOfASupervisor(String email);

    public boolean updateInformationStudent(String email, String name, String phone, boolean gender, String address, String birthDate) throws ParseException;
}
