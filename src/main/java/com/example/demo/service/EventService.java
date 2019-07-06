package com.example.demo.service;

import com.example.demo.entity.Event;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    EventRepository eventRepository;

    public List<Event> getEventList(String email) {
        List<Event> events = eventRepository.findEventsByStudentEmail(email);
        if (events != null) {
            return events;
        }
        return null;
    }
}