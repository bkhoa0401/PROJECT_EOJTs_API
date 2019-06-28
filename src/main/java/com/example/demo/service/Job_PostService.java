package com.example.demo.service;

import com.example.demo.entity.Business;
import com.example.demo.entity.Job_Post;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.repository.Job_PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;

@Service
public class Job_PostService {
    @Autowired
    Job_PostRepository job_postRepository;

    @Autowired
    BusinessService businessService;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    public void saveJobPost(Job_Post job_post) {
        if (job_post != null) {
            job_postRepository.save(job_post);
        }
    }

    public Job_Post findJob_PostById(int id) {
        Job_Post job_post = job_postRepository.findJob_PostById(id);
        if (job_post != null) {
            return job_post;
        }
        return null;
    }

    public int getViewOfJobPost(int id) {
        Job_Post job_post = job_postRepository.findJob_PostById(id);
        if (job_post != null) {
            return job_post.getViews();
        }
        return 0;
    }

    public void updateViewOfJobPost(int id, int views) {
        Job_Post job_post = job_postRepository.findJob_PostById(id);
        if (job_post != null) {
            job_post.setViews(views);
            job_postRepository.save(job_post);
        }
    }

    public boolean updateInforJobPost(Job_Post job_post) {
        Job_Post job_postIsExisted = job_postRepository.findJob_PostById(job_post.getId());
        if (job_postIsExisted != null) {
            job_postRepository.save(job_post);
            return true;
        }
        return false;
    }

    public List<Job_Post> getAllJobPost() {
        List<Job_Post> job_postList = job_postRepository.findJob_PostsOrderByTimePostDesc();
        if (job_postList != null) {
            return job_postList;
        }
        return null;
    }

    public List<Job_Post> getAllJobPostOfBusiness(Ojt_Enrollment ojt_enrollment) {
        List<Job_Post> job_postList = job_postRepository.findJob_PostByOjt_enrollment(ojt_enrollment);
        if (job_postList != null) {
            return job_postList;
        }
        return null;
    }

    public boolean createJob_Post(String emailBusiness,Job_Post job_post){
        Business business = businessService.getBusinessByEmail(emailBusiness);
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_enrollmentOfBusiness(business);
        if(job_post!=null){
            Date date = new Date(Calendar.getInstance().getTime().getTime());
            job_post.setTimePost(date);
            job_post.setOjt_enrollment(ojt_enrollment);
            job_postRepository.save(job_post);
            return true;
        }
        return false;
    }
}
