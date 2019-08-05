package com.example.demo.controller;

import com.example.demo.dto.EventDTO;
import com.example.demo.entity.Event;
import com.example.demo.service.EventService;
import com.example.demo.service.IEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/event")
public class EventController {

    @Autowired
    IEventService eventService;

    @GetMapping("/getEvent")
    @ResponseBody
    public ResponseEntity<EventDTO> getEventById(@RequestParam int id) {
        EventDTO eventDTO = eventService.findEventAndStudentsById(id);
        if (eventDTO.getStudentList().size() == 1 && eventDTO.getEvent().getStudent_events().get(0).isStudent() == true) {
            eventDTO.setStudentSent(true);
        } else {
            eventDTO.setStudentSent(false);
        }
        if (eventDTO != null) {
            return new ResponseEntity<EventDTO>(eventDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/setStateEvent")
    @ResponseBody
    public ResponseEntity<Void> setStateEvent(@RequestParam Integer eventId) {
        Event event = eventService.findEventById(eventId);
        if (event != null) {
            event.setRead(true);
            boolean result = eventService.updateEvent(event);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

}
