package com.example.demo.service;

import com.example.demo.entity.Role;
import com.example.demo.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
    @Autowired
    RoleRepository roleRepository;

    public Role findRoleById(int id) {
        Role role = roleRepository.findRoleById(id);
        if (role != null) {
            return role;
        }
        return null;
    }
}
