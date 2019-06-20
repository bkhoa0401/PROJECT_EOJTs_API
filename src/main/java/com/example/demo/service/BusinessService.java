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

    public Business getBusinessByEmail(String email) {
        Business business = businessRepository.findBusinessByEmail(email);
        if (business != null) {
            return business;
        }
        return null;
    }

    public boolean updateBusiness(String email, Business business) {
        Business businessFindByEmail = businessRepository.findBusinessByEmail(email);
        if (businessFindByEmail != null) {
            if (email.equals(business.getEmail())) {
                businessRepository.save(business);
                return true;
            }
        }
        return false;
    }

    public Business findBusinessByName(String name) {
        Business business = businessRepository.findBusinessByBusiness_name(name);
        if (business != null) {
            return business;
        }
        return null;
    }

}
