package com.example.demo.service;

import com.example.demo.entity.Skill;
import com.example.demo.repository.SkillRepository;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import javax.persistence.EntityManager;
import java.util.List;

@Service
public class SkillService {
    @Autowired
    SkillRepository skillRepository;

    @Autowired
    HibernateSearchService  hibernateSearchService;

    @Autowired
    private EntityManager entityManager;

    public int fullTextSearch(String skillName) {
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

        Skill skill = (Skill) jpaQuery.getSingleResult();

        return skill.getId();
    }

    public List<Skill> getListSkillBySpecialized(int specializedId){
        return skillRepository.findBySpecializedId(specializedId);
    }
}
