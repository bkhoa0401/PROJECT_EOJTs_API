package com.example.demo.service;

import com.example.demo.entity.Specialized;
import com.example.demo.repository.SpecializedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpecializedService {
    @Autowired
    SpecializedRepository specializedRepository;

    public List<Specialized> getAllSpecialized() {
        List<Specialized> list = new ArrayList<>();
        list = specializedRepository.findAll();
        return list;
    }


}
