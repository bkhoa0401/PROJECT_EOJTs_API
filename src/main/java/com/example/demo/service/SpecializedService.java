package com.example.demo.service;


import com.example.demo.entity.Specialized;
import com.example.demo.repository.SpecializedRepository;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.*;
import org.springframework.stereotype.Service;


import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Service
@CacheConfig(cacheNames = {"specialized"})
public class SpecializedService {
    @Autowired
    SpecializedRepository specializedRepository;

    @Autowired
    HibernateSearchService hibernateSearchService;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    public SpecializedService() {
    }

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

    List<Specialized> specializedListAll = new ArrayList<>();
    List<Specialized> specializedListTop = new ArrayList<>();

    @Cacheable(key = "'all'")
    public List<Specialized> getAllSpecialized() {
        //List<Specialized> list;
        specializedListAll = specializedRepository.findAll();
        if (specializedListAll != null) {
            return specializedListAll;
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

    @Cacheable(key = "'top'")
    public List<Specialized> getTop2() {
        // List<Specialized> specializedList = specializedRepository.findTop2ByStatusIsTrue();
        specializedListTop = specializedRepository.findTop2ByStatusIsTrue();
        return specializedListTop;
    }

    @Caching(put = {
            @CachePut(key = "'all'")
//            ,
//            @CachePut(key = "'top'")
    })
    public List<Specialized> updateSpecialized(Specialized specialized) {
        Specialized specializedFound = specializedRepository.findSpecializedById(specialized.getId());
        if (specializedFound != null) {
            specializedRepository.save(specialized); //save db
            this.specializedListAll.set(specialized.getId() - 1, specialized); // save redis
            return specializedListAll;
        }
        return null;
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

    @Cacheable(value = "specializedID", key = "#id")
    public Specialized getSpecializedById(int id) {
        Specialized specialized = specializedRepository.findSpecializedById(id);
        if (specialized != null) {
            return specialized;
        } else {
            return null;
        }
    }
}
