package com.example.demo.service;

import com.example.demo.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EvaluationService {
    @Autowired
    EvaluationRepository evaluationRepository;
}
