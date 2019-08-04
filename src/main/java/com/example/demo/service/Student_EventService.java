package com.example.demo.service;

import com.example.demo.entity.Student_Event;
import com.example.demo.repository.IStudent_EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Student_EventService implements  IStudent_EventService{
    @Autowired
    IStudent_EventRepository iStudent_eventRepository;

    @Override
    public void saveStudentEvent(Student_Event student_event) {
        iStudent_eventRepository.save(student_event);
    }
}
