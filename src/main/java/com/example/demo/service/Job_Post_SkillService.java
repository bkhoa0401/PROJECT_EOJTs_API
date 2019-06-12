package com.example.demo.service;

import com.example.demo.entity.Job_Post_Skill;
import com.example.demo.repository.Job_Post_SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Job_Post_SkillService {
    @Autowired
    Job_Post_SkillRepository job_post_skillRepository;

    public void saveJobPostSkill(Job_Post_Skill job_post_skill) {
        if (job_post_skill != null) {
            job_post_skillRepository.save(job_post_skill);
        }
    }
}
