package com.example.demo.service;


import com.example.demo.dto.SpecializedPagingDTO;
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
import org.springframework.stereotype.Service;


import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@CacheConfig(cacheNames = "specialized")
public class SpecializedService implements ISpecializedService {

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


    List<Specialized> specializedListAll = new ArrayList<>();


    @Cacheable(key = "'all'")
    public List<Specialized> getAllSpecialized() {
        //List<Specialized> list;
        specializedListAll = ISpecializedRepository.findAll();
        if (specializedListAll != null) {
            return specializedListAll;
        }
        return null;
    }

    @Cacheable(key = "{#currentPage,#rowsPerPage}")
    public SpecializedPagingDTO pagingSpecialized(int currentPage, int rowsPerPage) {
        if (specializedListAll == null || specializedListAll.size() == 0) {
            specializedListAll = ISpecializedRepository.findAll();
        }

//        int length = specializedListAll.size();
//
//        double pageCount = Math.ceil((double) length / (double) pageSize);
//
//        int currentItemStart;
//
//        if (page == 1) {
//            currentItemStart = 0;
//        } else {
//            currentItemStart = ((page - 1) * pageSize);
//        }
//
//        int count = 0;
//        List<Specialized> listPaging = new ArrayList<>();
//        for (int i = currentItemStart; i < specializedListAll.size(); i++) {
//            if (count < pageSize) {
//                Specialized specialized = specializedListAll.get(i);
//                if (specialized != null) {
//                    listPaging.add(specialized);
//                    count++;
//                } else {
//                    break;
//                }
//            } else {
//                break;
//            }
//        }
//        return listPaging;

        int pageNumber = (int) Math.ceil((double) specializedListAll.size() / (double) rowsPerPage);

        int nextPageNumber = (currentPage + 1) * rowsPerPage;

        int currentPageNumber = (currentPage * rowsPerPage);

        List<Specialized> specializedsPagination = new ArrayList<>();

        for (int i = 0; i < specializedListAll.size(); i++) {
            if (i >= currentPageNumber && i < nextPageNumber) {
                specializedsPagination.add(specializedListAll.get(i));
            }
        }

        SpecializedPagingDTO specializedPagingDTO = new SpecializedPagingDTO();
        specializedPagingDTO.setPageNumber(pageNumber);
        specializedPagingDTO.setSpecializedList(specializedsPagination);

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

    @CachePut(key = "'all'")
    @CacheEvict(allEntries = true)
    public List<Specialized> updateSpecialized(Specialized specialized) {
        Specialized specializedFound = ISpecializedRepository.findSpecializedById(specialized.getId());
        if (specializedFound != null) {
            ISpecializedRepository.save(specialized); //save db

            if (this.specializedListAll.size() == 0) {
                this.specializedListAll = ISpecializedRepository.findAll();
            }
            this.specializedListAll.set(specialized.getId() - 1, specialized); // save redis
            return specializedListAll;
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


