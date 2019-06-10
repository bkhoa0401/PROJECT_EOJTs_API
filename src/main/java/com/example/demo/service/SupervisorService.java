package com.example.demo.service;

import com.example.demo.repository.SupervisorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupervisorService {
    @Autowired
    SupervisorRepository supervisorRepository;
}
