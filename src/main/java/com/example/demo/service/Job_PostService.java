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
}
