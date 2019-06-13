package com.example.demo.service;

import com.example.demo.entity.Business;
import com.example.demo.repository.BusinessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessService {
    @Autowired
    BusinessRepository businessRepository;

    public void saveBusiness(Business business) {
        businessRepository.save(business);
    }

    public List<Business> getAllBusiness() {
        List<Business> businessList = businessRepository.findAll();
        if (businessList != null) {
            return businessList;
        }
        return null;
    }
}
