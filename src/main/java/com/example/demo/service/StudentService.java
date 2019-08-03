package com.example.demo.service;

import com.example.demo.dto.StudentAnswerDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.IStudentRepository;
import com.example.demo.repository.ISupervisorRepository;
import com.example.demo.repository.ITaskRepository;
import com.example.demo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class StudentService implements IStudentService {
    @Autowired
    IStudentRepository IStudentRepository;

    @Autowired
    ISupervisorRepository ISupervisorRepository;

    @Autowired
    IJob_PostService job_postService;

    @Autowired
    ISkillService skillService;

    @Autowired
    IBusinessService businessService;

    @Autowired
    ITaskService taskService;

    @Autowired
    ITaskRepository ITaskRepository;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IAnswerService iAnswerService;

    @Autowired
    IStudent_AnswerService iStudent_answerService;

    @Override
    public Student getStudentByEmail(String email) {
        Student student = IStudentRepository.findByEmail(email);
        return student;
    }

    @Override
    public boolean saveListStudent(List<Student> studentList) {
        IStudentRepository.saveAll(studentList);
        return true;
    }

    @Override
    public boolean saveStudent(Student student) {
        IStudentRepository.save(student);
        return true;
    }

    //@Cacheable(value = "students")
    @Override
    public List<Student> getAllStudents() {
        return IStudentRepository.findAll();
    }

    //check semester //ok
    //@Cacheable("students")
    @Override
    public List<Student> getAllStudentsBySemesterId() {
        List<Student> studentList = new ArrayList<>();
        Semester semester = semesterService.getSemesterCurrent();
        List<Ojt_Enrollment> ojt_enrollmentList =
                ojt_enrollmentService.getOjt_EnrollmentsBySemesterIdAndStudentEmailNotNull(semester.getId());
        for (int i = 0; i < ojt_enrollmentList.size(); i++) {
            Student student = ojt_enrollmentList.get(i).getStudent();
            studentList.add(student);
        }
        if (studentList != null) {
            return studentList;
        }
        return null;
    }

    @Override
    public int getSpecializedIdByEmail(String email) {
        Student student = getStudentByEmail(email);
        int specializedId = student.getSpecialized().getId();

        return specializedId;
    }

    @Override
    public boolean updateInforStudent(String email, String ojective, List<Skill> skillList) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            student.setObjective(ojective);
            student.setSkills(skillList);
            IStudentRepository.save(student);
            return true;
        }
        return false;
    }

    @Override
    public String updateOption1Student(String email, String option1) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            if (option1 != null || !option1.isEmpty()) {
                student.setOption1(option1);
            }
            IStudentRepository.save(student);
            return "success";
        }

        return "fail";
    }

    @Override
    public String updateOption2Student(String email, String option2) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            if (option2 != null || !option2.isEmpty()) {
                student.setOption2(option2);
            }
            IStudentRepository.save(student);
            return "success";
        }
        return "fail";
    }

    @Override
    public Student getStudentIsInvited(String email) {
        Student student = IStudentRepository.findByEmail(email);
        if (student != null) {
            return student;
        }
        return null;
    }

    //check semester ok
    @Override
    public List<Student> findStudentByBusinessNameOption(String option1, String option2) {
        List<Student> studentList = IStudentRepository.findStudentByOption1OrOption2(option1, option2);

        Semester semester = semesterService.getSemesterCurrent();

        List<Ojt_Enrollment> ojt_enrollmentList = new ArrayList<>();
        for (int i = 0; i < studentList.size(); i++) {
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(studentList.get(i).getEmail(), semester.getId());
            if (ojt_enrollment != null) {
                ojt_enrollmentList.add(ojt_enrollment);
            }
        }

        List<Student> studentListCurrent = new ArrayList<>();
        for (int i = 0; i < ojt_enrollmentList.size(); i++) {
            Student student = ojt_enrollmentList.get(i).getStudent();
            if (student != null) {
                studentListCurrent.add(student);
            }
        }
        if (studentListCurrent != null) {
            return studentListCurrent;
        }
        return null;
    }

    @Override
    public boolean updateLinkFileResumeForStudent(String email, String resumeLink) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            if (resumeLink != null) {
                student.setResumeLink(resumeLink);
                IStudentRepository.save(student);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean updateStatusOptionOfStudent(List<Integer> numberOfOption, boolean statusOfOption, String emailStudent) {
        Student student = getStudentByEmail(emailStudent);
        boolean flag = false;

        if (student != null) {
            for (int i = 0; i < numberOfOption.size(); i++) {
                if (numberOfOption.get(i) == 1) {
                    student.setAcceptedOption1(statusOfOption);
                    student.setInterviewed1(true);
                    IStudentRepository.save(student);
                    flag = true;
                }
                if (numberOfOption.get(i) == 2) {
                    student.setAcceptedOption2(statusOfOption);
                    student.setInterviewed2(true);
                    IStudentRepository.save(student);
                    flag = true;
                }
            }
        }

        if (flag) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<Student> getAllStudentByStatusOption(int typeGetStatus) {
        List<Student> studentList;
        if (typeGetStatus == 1) {// get all sv pass  option 1
            studentList = IStudentRepository.findStudentsByAcceptedOption1TrueAndAcceptedOption2False();
            return studentList;
        } else if (typeGetStatus == 2) {// get all sv pass  option 2
            studentList = IStudentRepository.findStudentsByAcceptedOption2TrueAndAcceptedOption1False();
            return studentList;
        } else if (typeGetStatus == 3) {// get all sv pass 2 option
            studentList = IStudentRepository.findStudentsByAcceptedOption1TrueAndAcceptedOption2True();
            return studentList;
        } else if (typeGetStatus == 4) {// get all sv fail 2 option
            studentList = IStudentRepository.findStudentsByAcceptedOption1FalseAndAcceptedOption2False();
            return studentList;
        }
        return null;
    }

    @Override
    public boolean updateTokenDeviceForStudent(String emailStudent, String token) {
        Student student = getStudentByEmail(emailStudent);
        if (student != null) {
            student.setToken(token);
            IStudentRepository.save(student);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateLinkTranscriptForStudent(Student student) {
        IStudentRepository.save(student);
        return true;
    }

    @Override
    public boolean assignSupervisorForStudent(List<Student> studentList) {
        if (studentList.size() != 0) {
            IStudentRepository.saveAll(studentList);
            return true;
        }
        return false;
    }

    //check semester //chua test
    @Override
    public List<Job_Post> getSuggestListJobPost(String emailStudent) {
        Student student = IStudentRepository.findByEmail(emailStudent);
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
        Semester semester = semesterService.getSemesterCurrent();

        List<Job_Post> job_postListSuggestCurrentSemester = new ArrayList<>();

        for (int i = 0; i < job_postListSuggest.size(); i++) {
            Job_Post job_post = job_postListSuggest.get(i);
            if (semester.getId() == job_post.getOjt_enrollment().getSemester().getId()) {
                job_postListSuggestCurrentSemester.add(job_post);
            }
        }
        return job_postListSuggestCurrentSemester;
        //return job_postListSuggest;
    }

    @Override
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

        // float indexSimilarAndStudentSkills = (float) similar / (float) skillListStudent.size();
        float indexSimilarAndJobPostSkills = (float) similar / (float) skillListJobPost.size();

        float result = indexSimilarAndJobPostSkills;
        //   float result = (indexSimilarAndStudentSkills + indexSimilarAndJobPostSkills) / 2;

        return result;
    }

    @Override
    public boolean updateLinkAvatar(String emailStudent, String linkAvatar) {
        Student student = IStudentRepository.findByEmail(emailStudent);
        if (student != null) {
            student.setAvatarLink(linkAvatar);
            IStudentRepository.save(student);
            return true;
        }
        return false;
    }

    @Override
    public Business getBusinessOfStudent(String studentEmail) {
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(studentEmail);
        Business business = ojt_enrollment.getBusiness();
        if (business != null) {
            return business;
        }
        return null;
    }

    @Override
    public List<Business> getBusinessByOptionStudent(String studentEmail) {

        Student student = IStudentRepository.findByEmail(studentEmail);

        String option1 = student.getOption1();
        String option2 = student.getOption2();

        Business businessOption1 = businessService.findBusinessByName((option1));
        Business businessOption2 = businessService.findBusinessByName((option2));

        List<Business> businessList = new ArrayList<>();
        if (businessOption1 != null) {
            businessList.add(businessOption1);
        }
        if (businessOption2 != null) {
            businessList.add(businessOption2);
        }
        return businessList;
    }

    //check semester //ok
    @Override
    public List<Student> getAllStudentOfASupervisor(String email) {
        List<Student> studentList = IStudentRepository.findStudentsBySupervisorEmail(email);

        Semester semester = semesterService.getSemesterCurrent();

        List<Ojt_Enrollment> ojt_enrollmentListStudentAtSemester = new ArrayList<>();

        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(student.getEmail(), semester.getId());
            if (ojt_enrollment != null) {
                ojt_enrollmentListStudentAtSemester.add(ojt_enrollment);
            }
        }
        List<Student> studentsBySemester = new ArrayList<>();

        for (int i = 0; i < ojt_enrollmentListStudentAtSemester.size(); i++) {
            Student student = ojt_enrollmentListStudentAtSemester.get(i).getStudent();
            if (student != null) {
                studentsBySemester.add(student);
            }
        }
        if (studentsBySemester != null) {
            return studentsBySemester;
        }
        return null;
    }

    @Override
    public boolean updateInformationStudent(String email, String name, String phone, boolean gender, String address, String birthDate) throws ParseException {
        Student student = IStudentRepository.findByEmail(email);
        if (student != null) {
            student.setName(name);
            student.setPhone(phone);
            student.setGender(gender);
            student.setAddress(address);

            SimpleDateFormat sdf1 = new SimpleDateFormat("dd-MM-yyyy");
            java.util.Date date = sdf1.parse(birthDate);
            java.sql.Date dob = new java.sql.Date(date.getTime());

            student.setDob(dob);
            IStudentRepository.save(student);
            return true;
        }
        return false;
    }

    @Override
    public void postFeedBack(String email, String content) {
        Student student = getStudentByEmail(email);

        Answer answer = new Answer();
        answer.setContent(content);

        iAnswerService.saveAnswer(answer);
        iStudent_answerService.saveFeedback(student, answer);
    }

    @Override
    public List<StudentAnswerDTO> findListStudentAnswer(String email) {
        List<StudentAnswerDTO> answerDTOS = new ArrayList<>();

        List<Student_Answer> student_answers = iStudent_answerService.findStudentAnswersByEmail(email);

        for (int i = 0; i < student_answers.size(); i++) {
            Student student = student_answers.get(i).getStudent();
            Business business = student.getSupervisor().getBusiness();
            Answer answer = student_answers.get(i).getAnswer();
            Question question = answer.getQuestion();

            StudentAnswerDTO studentAnswerDTO = new StudentAnswerDTO();
            studentAnswerDTO.setStudentEmail(student.getEmail());
            studentAnswerDTO.setBusinessEmail(business.getEmail());

            List<Answer> answers=getListAnswerOfQuestion(student.getEmail(),question.getId(),student_answers);
            studentAnswerDTO.setAnswers(answers);
            studentAnswerDTO.setQuestion(question);

            answerDTOS.add(studentAnswerDTO);
        }
        return answerDTOS;
    }

    public List<Answer> getListAnswerOfQuestion(String emailStudent, int idQuestion, List<Student_Answer> student_answers) {
        List<Answer> answers = new ArrayList<>();
        for (int i = 0; i < student_answers.size(); i++) {
            Student_Answer student_answer = student_answers.get(i);
            if (student_answer.getStudent().getEmail().equals(emailStudent)) {
                if (student_answer.getAnswer().getQuestion().getId() == idQuestion) {
                    answers.add(student_answers.get(i).getAnswer());
                }
            }
        }
        return answers;
    }

}
