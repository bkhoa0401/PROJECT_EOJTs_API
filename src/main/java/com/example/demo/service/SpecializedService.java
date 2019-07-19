package com.example.demo.service;

import com.example.demo.entity.Specialized;
import com.example.demo.repository.ISpecializedRepository;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Service
public class SpecializedService implements ISpecializedService{
    @Autowired
    ISpecializedRepository ISpecializedRepository;

    @Autowired
    HibernateSearchService hibernateSearchService;

    @Autowired
    private EntityManager entityManager;

    @Override
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

    @Override
    @Cacheable("specializeds")
    public List<Specialized> getAllSpecialized() {
        List<Specialized> list ;
        list = ISpecializedRepository.findAll();
        if (list != null) {
            return list;
        } else {
            return null;
        }
    }

    @Override
//    @CacheEvict(value = "specializeds", allEntries = true)
    @Cacheable("specializeds")
    public List<Specialized> getAllSpecializedForCache() {
        List<Specialized> list = new ArrayList<>();
        list = ISpecializedRepository.findAll();
        if (list != null) {
            return list;
        } else {
            return null;
        }
    }

    @Override
    public int getIdByName(String name) {
        return ISpecializedRepository.findSpecializedIdByName(name);
    }

    @Override
    public boolean createSpecialized(Specialized specialized) {
        try {
            ISpecializedRepository.save(specialized);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @CachePut(value = "specializedID", key = "#specialized.id")
    @CacheEvict(value = "specializeds", allEntries = true)
    public Specialized updateSpecialized(Specialized specialized) {
        Specialized specializedFound = ISpecializedRepository.findSpecializedById(specialized.getId());
        if (specializedFound != null) {
            ISpecializedRepository.save(specialized);
            getAllSpecializedForCache();
            return specialized;
        }
        return null;
    }

    @Override
    public boolean updateStatusSpecialized(int specializedId, boolean status) {
        Specialized specializedFound = ISpecializedRepository.findSpecializedById(specializedId);
        if (specializedFound != null) {
            specializedFound.setStatus(status);
            ISpecializedRepository.save(specializedFound);
            return true;
        }
        return false;
    }

    @Override
    @Cacheable(value = "specializedID", key = "#id")
    public Specialized getSpecializedById(int id) {
        Specialized specialized = ISpecializedRepository.findSpecializedById(id);
        if (specialized != null) {
            return specialized;
        } else {
            return null;
        }
    }
}
