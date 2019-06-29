package com.example.demo.service;

import com.example.demo.entity.Job_Post;
import com.example.demo.entity.Job_Post_Skill;
import com.example.demo.entity.Skill;
import com.example.demo.entity.Specialized;
import com.example.demo.repository.SkillRepository;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Service
public class SkillService {
    @Autowired
    SkillRepository skillRepository;

    @Autowired
    HibernateSearchService hibernateSearchService;

    @Autowired
    private EntityManager entityManager;

    public int fullTextSearch(String skillName) {
        int skillId = 0;
        hibernateSearchService.initializeHibernateSearch();

        FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(entityManager);

        QueryBuilder queryBuilder = fullTextEntityManager.getSearchFactory()
                .buildQueryBuilder()
                .forEntity(Skill.class)
                .get();

        org.apache.lucene.search.Query query = queryBuilder
                .keyword()
                .onFields("name")
                .matching(skillName)
                .createQuery();

        org.hibernate.search.jpa.FullTextQuery jpaQuery
                = fullTextEntityManager.createFullTextQuery(query, Skill.class);

        try {
            Skill skill = (Skill) jpaQuery.getSingleResult();
            skillId = skill.getId();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return skillId;
    }

    public List<Skill> getListSkillBySpecialized(int specializedId) {
        return skillRepository.findBySpecializedId(specializedId);
    }


    public List<Skill> getAllSkill() {
        List<Skill> list = new ArrayList<>();
        list = skillRepository.findAll();
        if (list != null) {
            return list;
        } else {
            return null;
        }
    }

    public boolean createSkill(Skill skill) {
        try {
            skillRepository.save(skill);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateSkill(Skill skill) {
        Skill skillFound = skillRepository.findSkillById(skill.getId());
        if (skillFound != null) {
            skillRepository.save(skill);
            return true;
        }
        return false;
    }

    public boolean updateStatusSkill(int skillId, boolean status) {
        Skill skillFound = skillRepository.findSkillById(skillId);
        if (skillFound != null) {
            skillFound.setStatus(status);
            skillRepository.save(skillFound);
            return true;
        }
        return false;
    }

    public Skill getSkillById(int id) {
        Skill skill = skillRepository.findSkillById(id);
        if (skill != null) {
            return skill;
        } else {
            return null;
        }
    }

    public List<Skill> getListSkillJobPost(Job_Post job_post) {

        List<Job_Post_Skill> job_post_skills = job_post.getJob_post_skills();
        List<Skill> skillList = new ArrayList<>();

        for (int i = 0; i < job_post_skills.size(); i++) {
            skillList.add(job_post_skills.get(i).getSkill());
        }
        return skillList;
    }
}
