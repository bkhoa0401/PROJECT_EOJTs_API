package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.BusinessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BusinessService {
    @Autowired
    BusinessRepository businessRepository;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    StudentService studentService;

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

        if (businessList != null) {
            for (int i = 0; i < businessList.size(); i++) {
                if (i < 5) {
                    businessListTop5.add(businessList.get(i));
                } else {
                    break;
                }
            }
            return businessListTop5;
        }
        return null;
    }

    public List<Student> getSuggestListStudent(String emailBusiness) {
        Business business = businessRepository.findBusinessByEmail(emailBusiness);
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_enrollmentOfBusiness(business);

        List<Student> studentListSuggest = new ArrayList<>();

        //lay duoc list skill cua doanh nghiep
        //List<Skill> skillListBusiness = new ArrayList<>();
        List<Skill> skillListOfAJobPost = new ArrayList<>();

        List<Job_Post> job_postListOfBusiness = new ArrayList<>();
        for (int i = 0; i < ojt_enrollment.getJob_posts().size(); i++) {
            job_postListOfBusiness.add(ojt_enrollment.getJob_posts().get(i)); // lay duoc list job post
//            for (int j = 0; j < ojt_enrollment.getJob_posts().get(i).getJob_post_skills().size(); j++) {
//                Skill skill = ojt_enrollment.getJob_posts().get(i).getJob_post_skills().get(j).getSkill();
//                skillListBusiness.add(skill);
//            }
        }

        List<Student> studentList = studentService.getAllStudents();

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
                    if(!studentListSuggest.contains(studentList.get(i))){
                        studentListSuggest.add(studentList.get(i));
                    }
                }
                skillListOfAJobPost=new ArrayList<>();
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

}
