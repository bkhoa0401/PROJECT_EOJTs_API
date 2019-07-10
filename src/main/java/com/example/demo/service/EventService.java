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

    public List<Event> getEventListOfAdmin(String email) {
        List<Event> events = eventRepository.findEventsByAdmin_Email(email);
        if (events != null) {
            return events;
        }
        return null;
    }

    public List<Event> getEventListOfBusiness(String email) {
        List<Event> events = eventRepository.findEventsByBusinessEmail(email);
        if (events != null) {
            return events;
        }
        return null;
    }


    public int countEventIsNotRead(String email) {
        int count = eventRepository.findEventsByStudentEmailAndReadIsFalse(email);

        return count;
    }

    public Event findEventById(int id) {
        Event event = eventRepository.findEventById(id);
        if (event != null) {
            return event;
        }
        return null;
    }

    public boolean createEvent(Event event) {
        if (event != null) {
            eventRepository.save(event);
            return true;
        }
        return false;
    }
}
