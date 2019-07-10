package com.example.demo.service;

import com.example.demo.entity.Admin;
import com.example.demo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    AdminRepository adminRepository;

    public Admin findAdminByEmail(String email) {
        Admin admin = adminRepository.findAdminByEmail(email);
        if (admin != null) {
            return admin;
        }
        return null;
    }
}
