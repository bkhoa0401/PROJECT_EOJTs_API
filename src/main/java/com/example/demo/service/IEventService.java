package com.example.demo.service;

import com.example.demo.dto.EventDTO;
import com.example.demo.entity.Event;

import java.util.List;

public interface IEventService {

    List<Event> getEventList(String email);

    List<Event> getEventListOfAdmin(String email);

    List<Event> getEventListOfBusiness(String email);

    List<Event> getEventListSent(List<Event> eventList);

    List<Event> getEventListReceived(List<Event> eventList);

    int countEventIsNotRead(String email);

    Event findEventById(int id);

    EventDTO findEventAndStudentsById(int id);

    boolean createEvent(Event event);

    boolean updateEvent(Event event);

    boolean updateStatusIsRead(int id);
}
