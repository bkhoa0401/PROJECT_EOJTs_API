package com.example.demo.service;

import com.example.demo.dto.Business_JobPostDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class BusinessService {
    @Autowired
    BusinessRepository businessRepository;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    StudentService studentService;

    @Autowired
    EvaluationRepository evaluationRepository;

    @Autowired
    SemesterService semesterService;

    public void saveBusiness(Business business) {
        businessRepository.save(business);
    }

    public List<Business> getAllBusiness() {
        List<Business> businessList = businessRepository.findAll();
        if (businessList != null) {
            return businessList;
        }
        return null;
    }

    public List<Business> getAllBusinessBySemester() {
        Semester semester = semesterService.getSemesterCurrent();

        List<Ojt_Enrollment> ojt_enrollmentList =
                ojt_enrollmentService.getOjt_EnrollmentsBySemesterIdAndBusinessEmailNotNull(semester.getId());
        List<Business> businessList = new ArrayList<>();

        for (int i = 0; i < ojt_enrollmentList.size(); i++) {
            Business business = ojt_enrollmentList.get(i).getBusiness();
            businessList.add(business);
        }

        if (businessList != null) {
            return businessList;
        }
        return null;
    }

    public Business getBusinessByEmail(String email) {
        Business business = businessRepository.findBusinessByEmail(email);
        if (business != null) {
            return business;
        }
        return null;
    }

    public boolean updateBusiness(String email, Business business) {
        Business businessFindByEmail = businessRepository.findBusinessByEmail(email);
        if (businessFindByEmail != null) {
            if (email.equals(business.getEmail())) {
                businessRepository.save(business);
                return true;
            }
        }
        return false;
    }

    public Business findBusinessByName(String name) {
        Business business = businessRepository.findBusinessByBusiness_eng_name(name);
        if (business != null) {
            return business;
        }
        return null;
    }

    public List<Business> findTop5BusinessByRateAverage() {
        List<Business> businessList = businessRepository.findTop5OrderByRateAverageDesc();
        List<Business> businessListTop5 = new ArrayList<>();

        Semester semester = semesterService.getSemesterCurrent();
        List<Ojt_Enrollment> ojt_enrollmentBusinessCurrent = new ArrayList<>();

        for (int i = 0; i < businessList.size(); i++) {
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessList.get(i).getEmail(), semester.getId());
            if (ojt_enrollment != null) {
                ojt_enrollmentBusinessCurrent.add(ojt_enrollment);
            }
        }

        if (ojt_enrollmentBusinessCurrent != null) {
            for (int i = 0; i < ojt_enrollmentBusinessCurrent.size(); i++) {
                if (i < 5) {
                    businessListTop5.add(ojt_enrollmentBusinessCurrent.get(i).getBusiness());
                } else {
                    break;
                }
            }
            return businessListTop5;
        }
        return null;
    }

    // check semester // ok
    public List<Student> getSuggestListStudent(String emailBusiness) {

//        Business business = businessRepository.findBusinessByEmail(emailBusiness);
//        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_enrollmentOfBusiness(business);

        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());
        List<Student> studentListSuggest = new ArrayList<>();

        //lay duoc list skill cua doanh nghiep
        //List<Skill> skillListBusiness = new ArrayList<>();
        List<Skill> skillListOfAJobPost = new ArrayList<>();

        List<Job_Post> job_postListOfBusiness = new ArrayList<>();
        for (int i = 0; i < ojt_enrollment.getJob_posts().size(); i++) {
            job_postListOfBusiness.add(ojt_enrollment.getJob_posts().get(i)); // lay duoc list job post
        }

        //List<Student> studentList = studentService.getAllStudents();
        List<Student> studentList = studentService.getAllStudentsBySemesterId();

        for (int i = 0; i < studentList.size(); i++) {
            List<Skill> skillListOfAStudent = studentList.get(i).getSkills();

            for (int j = 0; j < job_postListOfBusiness.size(); j++) {
                Job_Post job_post = job_postListOfBusiness.get(j);
                for (int k = 0; k < job_post.getJob_post_skills().size(); k++) {
                    Skill skill = job_post.getJob_post_skills().get(k).getSkill();
                    skillListOfAJobPost.add(skill);
                }
                //get ra list skill phu hop theo nganh cua tung thang student
                List<Skill> skills = getListSkillBySpecializedOfStudent(skillListOfAJobPost, studentList.get(i).getSpecialized().getId());

                float result = studentService.compareSkillsStudentAndSkillsJobPost(skillListOfAStudent, skills);

                if (result >= 0.5) {
                    if (!studentListSuggest.contains(studentList.get(i))) {
                        studentListSuggest.add(studentList.get(i));
                    }
                }
                skillListOfAJobPost = new ArrayList<>();
            }

        }
        return studentListSuggest;
    }

    public List<Skill> getListSkillBySpecializedOfStudent(List<Skill> skillListOfBusiness, int specialized) {
        List<Skill> list = new ArrayList<>();
        for (int i = 0; i < skillListOfBusiness.size(); i++) {
            if (skillListOfBusiness.get(i).getSpecialized().getId() == specialized) {
                list.add(skillListOfBusiness.get(i));
            }
        }
        return list;
    }

    public void updateRateNumber(String email, int rate) {
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);
        Business business = ojt_enrollment.getBusiness();

        int countRate = business.getRateCount();
        float currentRate = business.getRateAverage();
        if (currentRate == 0) {

        }
        float average = (currentRate + (float) rate) / 2;
        if (currentRate == 0) {
            business.setRateAverage(rate);
        } else {
            business.setRateAverage(average);
        }
        business.setRateCount(++countRate);

        businessRepository.save(business);
    }

    //@Cacheable(value = "jobposts",unless= "#result.size() == 0")
    //check semester //ok
    public List<Business_JobPostDTO> getAllJobPostOfBusinesses() {
        // List<Business> businessList = getAllBusiness();
        List<Business> businessList = getAllBusinessBySemester();
        List<Business_JobPostDTO> business_jobPostDTOList = new ArrayList<>();

        for (int i = 0; i < businessList.size(); i++) {
            Business_JobPostDTO business_jobPostDTO = new Business_JobPostDTO();
            business_jobPostDTO.setBusiness(businessList.get(i));

            //get instance ojt_enrollments

            Semester semesterCurrent = semesterService.getSemesterCurrent();
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessList.get(i).getEmail(), semesterCurrent.getId());
            for (int j = 0; j < ojt_enrollment.getJob_posts().size(); j++) {
                Job_Post job_post = ojt_enrollment.getJob_posts().get(j);
                business_jobPostDTO.setJob_post(job_post);
                business_jobPostDTOList.add(business_jobPostDTO);

                business_jobPostDTO = new Business_JobPostDTO();
                business_jobPostDTO.setBusiness(businessList.get(i));
            }
        }

        Collections.sort(business_jobPostDTOList);
        return business_jobPostDTOList;
    }

}
