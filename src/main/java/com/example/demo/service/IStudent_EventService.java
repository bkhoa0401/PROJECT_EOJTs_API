package com.example.demo.service;

import com.example.demo.entity.Student_Event;
import com.example.demo.repository.IStudent_EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


public interface IStudent_EventService {
    void saveStudentEvent(Student_Event student_event);
}
