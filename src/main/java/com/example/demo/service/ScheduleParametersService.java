package com.example.demo.service;

import com.example.demo.entity.ScheduleParameters;
import com.example.demo.repository.ScheduleParametersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ScheduleParametersService {

    @Autowired
    ScheduleParametersRepository scheduleParametersRepository;

    public boolean addScheduleParameters(ScheduleParameters scheduleParameters) {
        scheduleParametersRepository.save(scheduleParameters);

        return true;
    }
}
