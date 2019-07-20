package com.example.demo.service;

import com.example.demo.entity.Event;

import java.util.List;

public interface IEventService {

    List<Event> getEventList(String email);

    List<Event> getEventListOfAdmin(String email);

    List<Event> getEventListOfBusiness(String email);

    int countEventIsNotRead(String email);

    Event findEventById(int id);

    boolean createEvent(Event event);

    boolean updateStatusIsRead(int id);
}
