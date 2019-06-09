package com.example.demo.service;

import com.example.demo.entity.Business;
import com.example.demo.repository.BusinessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BusinessService {
    @Autowired
    BusinessRepository businessRepository;

    public void importFileBusiness(List<Business> businessList) {
        if (businessList != null) {
            businessRepository.saveAll(businessList);
        }
    }
}
