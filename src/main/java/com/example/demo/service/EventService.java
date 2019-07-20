package com.example.demo.service;

import com.example.demo.entity.Event;
import com.example.demo.repository.IEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService implements IEventService{

    @Autowired
    IEventRepository IEventRepository;

    @Override
    public List<Event> getEventList(String email) {
        List<Event> events = IEventRepository.findEventsByStudentEmail(email);
        if (events != null) {
            return events;
        }
        return null;
    }

    @Override
    public List<Event> getEventListOfAdmin(String email) {
        List<Event> events = IEventRepository.findEventsByAdmin_Email(email);
        if (events != null) {
            return events;
        }
        return null;
    }

    @Override
    public List<Event> getEventListOfBusiness(String email) {
        List<Event> events = IEventRepository.findEventsByBusinessEmail(email);
        if (events != null) {
            return events;
        }
        return null;
    }

    @Override
    public int countEventIsNotRead(String email) {
        int count = IEventRepository.findEventsByStudentEmailAndReadIsFalse(email);

        return count;
    }

    @Override
    public Event findEventById(int id) {
        Event event = IEventRepository.findEventById(id);
        if (event != null) {
            event.setRead(true);
            IEventRepository.save(event);
            return event;
        }
        return null;
    }

    @Override
    public boolean createEvent(Event event) {
        if (event != null) {
            IEventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateStatusIsRead(int id) {
        Event event = findEventById(id);
        if (event != null) {
            event.setRead(true);
            IEventRepository.save(event);
            return true;
        }
        return false;
    }
}
