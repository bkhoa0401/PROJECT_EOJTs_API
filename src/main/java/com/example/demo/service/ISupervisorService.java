package com.example.demo.service;

import com.example.demo.entity.Supervisor;

import java.util.List;

public interface ISupervisorService {

    Supervisor findByEmail(String email);

    List<Supervisor> getAllSupervisorOfABusiness(String emailBusiness);

    boolean createSupervisor(Supervisor supervisor, String emailBusiness);

    boolean updateStateSupervisor(String email, boolean isActive);
}
