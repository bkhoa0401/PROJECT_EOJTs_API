package com.example.demo.service;

import com.example.demo.entity.Job_Post;
import com.example.demo.repository.Job_PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Job_PostService {
    @Autowired
    Job_PostRepository job_postRepository;

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
}
