package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.Job_PostRepository;
import com.example.demo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
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

    @Autowired
    Job_Post_SkillService job_post_skillService;

    @Autowired
    SemesterService semesterService;

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

    //check semester //ok
    public List<Job_Post> getAllJobPost() {
        Semester semester = semesterService.getSemesterCurrent();

        List<Job_Post> job_postList = job_postRepository.findJob_PostsOrderByTimePostDesc();

        List<Job_Post> job_postListCurrentSemester=new ArrayList<>();

        for (int i = 0; i < job_postList.size(); i++) {
            Semester semesterOfJobPost = job_postList.get(i).getOjt_enrollment().getSemester();
            if (semesterOfJobPost != null) {
                if (semesterOfJobPost.getId() == semester.getId()) {
                    job_postListCurrentSemester.add(job_postList.get(i));
                }
            }
        }
        if (job_postListCurrentSemester != null) {
            return job_postListCurrentSemester;
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

    //check semester ok
    //@CachePut(value = "jobposts")
    public boolean createJob_Post(String emailBusiness, Job_Post job_post) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());

        List<Job_Post_Skill> job_post_skill = job_post.getJob_post_skills();

        if (job_post != null) {
            Date date = new Date(Calendar.getInstance().getTime().getTime());
            job_post.setTimePost(date);
            job_post.setOjt_enrollment(ojt_enrollment);

            for (int i = 0; i < job_post_skill.size(); i++) {
                job_post_skill.get(i).setJob_post(job_post);
            }
            job_postRepository.save(job_post);
            return true;
        }
        return false;
    }


}
