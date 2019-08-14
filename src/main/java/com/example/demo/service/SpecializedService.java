package com.example.demo.service;


import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.Specialized;
import com.example.demo.repository.ISpecializedRepository;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.*;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;

import org.springframework.context.annotation.Bean;

import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;


import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class SpecializedService implements ISpecializedService {

    @Autowired
    ISpecializedRepository ISpecializedRepository;

    @Autowired
    HibernateSearchService hibernateSearchService;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private RedisTemplate<Object, Object> template;

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


    List<Specialized> specializedListAll = new ArrayList<>();


    public List<Specialized> getAllSpecialized() {
        ValueOperations values = template.opsForValue();
        List<Specialized> specializeds = (List<Specialized>) values.get("specialized");
        if (specializeds == null) {
            specializeds = ISpecializedRepository.findAll();
            values.set("specialized", specializeds);
            return specializeds;
        } else {
            return specializeds;
        }
    }

    public PagingDTO pagingSpecialized(int currentPage, int rowsPerPage) {
        List<Specialized> specializedList = getAllSpecialized();

        int pageNumber = (int) Math.ceil((double) specializedList.size() / (double) rowsPerPage); // ra tong so page

        int nextPageNumber = (currentPage + 1) * rowsPerPage;

        int currentPageNumber = (currentPage * rowsPerPage);

        List<Specialized> specializedsPagination = new ArrayList<>();

        for (int i = 0; i < specializedList.size(); i++) {
            if (i >= currentPageNumber && i < nextPageNumber) {
                specializedsPagination.add(specializedList.get(i));
            }
        }

        PagingDTO specializedPagingDTO = new PagingDTO();
        specializedPagingDTO.setPageNumber(pageNumber);
        specializedPagingDTO.setListData(specializedsPagination);

        return specializedPagingDTO;
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

    public List<Specialized> updateSpecialized(Specialized specialized) {
        ValueOperations values = template.opsForValue();
        List<Specialized> specializeds = (List<Specialized>) values.get("specialized");
        if (specializeds != null) {
            for (int i = 0; i < specializeds.size(); i++) {
                Specialized specializedIsExisted = specializeds.get(i);
                if (specialized.getId() == specializedIsExisted.getId()) {
                    ISpecializedRepository.save(specialized); // update db
                    specializeds.set(i, specialized);
                    values.set("specialized", specializeds); //update redis
                }
            }
            return specializeds;
        }
        return null;
    }


    @Override
//    @CachePut(key = "'all'")
//    @CacheEvict(allEntries = true)
    public List<Specialized> updateStatusSpecialized(int specializedId, boolean status) {
//        Specialized specializedFound = ISpecializedRepository.findSpecializedById(specializedId);
//        if (specializedFound != null) {
//            specializedFound.setStatus(status);
//            ISpecializedRepository.save(specializedFound);
//
//            if (this.specializedListAll.size() == 0) {
//                this.specializedListAll = ISpecializedRepository.findAll();
//            }
//            this.specializedListAll.set(specializedId - 1, specializedFound); // save redis
//            return specializedListAll;
//        }
//        return null;
        Specialized specializedFound = ISpecializedRepository.findSpecializedById(specializedId);
        ValueOperations values = template.opsForValue();
        List<Specialized> specializeds = (List<Specialized>) values.get("specialized");
        if (specializeds != null && specializedFound != null) {
            for (int i = 0; i < specializeds.size(); i++) {
                Specialized specializedIsExisted = specializeds.get(i);
                if (specializedIsExisted.getId() == specializedFound.getId()) {
                    specializedFound.setStatus(status);
                    ISpecializedRepository.save(specializedFound);
                    specializeds.set(i, specializedFound);
                    values.set("specialized", specializeds);
                }
            }
            return specializeds;
        }
        return null;
    }

    @Override
//    @Cacheable(value = "specializedID", key = "#id")
    public Specialized getSpecializedById(int id) {
        Specialized specialized = ISpecializedRepository.findSpecializedById(id);
        if (specialized != null) {
            return specialized;
        } else {
            return null;
        }
    }
}


