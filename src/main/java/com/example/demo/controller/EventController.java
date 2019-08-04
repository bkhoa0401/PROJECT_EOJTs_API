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
        if (eventDTO != null) {
            return new ResponseEntity<EventDTO>(eventDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

}
