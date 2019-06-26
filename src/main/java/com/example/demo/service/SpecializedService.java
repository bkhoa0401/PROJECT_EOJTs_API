package com.example.demo.service;

import com.example.demo.entity.Skill;
import com.example.demo.entity.Specialized;
import com.example.demo.repository.SpecializedRepository;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Service
public class SpecializedService {
    @Autowired
    SpecializedRepository specializedRepository;

    @Autowired
    HibernateSearchService hibernateSearchService;

    @Autowired
    private EntityManager entityManager;

    public int fullTextSearch(String specializedName) {
        int specializedId = 0;
        hibernateSearchService.initializeHibernateSearch();

        FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(entityManager);

        QueryBuilder queryBuilder = fullTextEntityManager.getSearchFactory()
                .buildQueryBuilder()
                .forEntity(Specialized.class)
                .get();

        org.apache.lucene.search.Query query = queryBuilder
                .keyword()
                .onFields("name")
                .matching(specializedName)
                .createQuery();

        org.hibernate.search.jpa.FullTextQuery jpaQuery
                = fullTextEntityManager.createFullTextQuery(query, Specialized.class);

        try {
            Specialized specialized = (Specialized) jpaQuery.getSingleResult();
            specializedId = specialized.getId();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return specializedId;
    }

    public List<Specialized> getAllSpecialized() {
        List<Specialized> list = new ArrayList<>();
        list = specializedRepository.findAll();
        if (list != null) {
            return list;
        } else {
            return null;
        }
    }

    public int getIdByName(String name) {
        return specializedRepository.findSpecializedIdByName(name);
    }

    public boolean createSpecialized(Specialized specialized) {
        try {
            specializedRepository.save(specialized);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateSpecialized(Specialized specialized) {
        Specialized specializedFound = specializedRepository.findSpecializedById(specialized.getId());
        if (specializedFound != null) {
            specializedRepository.save(specialized);
            return true;
        }
        return false;
    }

    public boolean updateStatusSpecialized(int specializedId, boolean status) {
        Specialized specializedFound = specializedRepository.findSpecializedById(specializedId);
        if (specializedFound != null) {
            specializedFound.setStatus(status);
            specializedRepository.save(specializedFound);
            return true;
        }
        return false;
    }

    public Specialized getSpecializedById(int id) {
        Specialized specialized = specializedRepository.findSpecializedById(id);
        if (specialized != null) {
            return specialized;
        } else {
            return null;
        }
    }
}
