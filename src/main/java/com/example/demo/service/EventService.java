package com.example.demo.service;

import com.example.demo.dto.EventDTO;
import com.example.demo.entity.Event;
import com.example.demo.entity.Semester;
import com.example.demo.entity.Student;
import com.example.demo.entity.Student_Event;
import com.example.demo.repository.IEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Service
public class EventService implements IEventService {

    @Autowired
    IEventRepository IEventRepository;

    @Autowired
    IStudent_EventService iStudent_eventService;

    @Autowired
    ISemesterService iSemesterService;

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
    public List<Event> getEventListSent(List<Event> eventList) {
        Semester semester = iSemesterService.getSemesterCurrent();
        Date dateStartSemester = semester.getStart_date();
        Date dateEndSemester = semester.getEnd_date();
        List<Event> finalListEvent = new ArrayList<Event>();
        for (int i = 0; i < eventList.size(); i++) {
            Date dateEventCreate = eventList.get(i).getTime_created();
            if (dateEventCreate.after(dateStartSemester) && dateEventCreate.before(dateEndSemester)) {
                if (eventList.get(i).getStudent_events().size() > 1 || eventList.get(i).getStudent_events().get(0).isStudent() == false) {
                    finalListEvent.add(eventList.get(i));
                }
            }
        }
        return finalListEvent;
    }

    @Override
    public List<Event> getEventListReceived(List<Event> eventList) {
        Semester semester = iSemesterService.getSemesterCurrent();
        Date dateStartSemester = semester.getStart_date();
        Date dateEndSemester = semester.getEnd_date();
        List<Event> finalListEvent = new ArrayList<Event>();
        for (int i = 0; i < eventList.size(); i++) {
            Date dateEventCreate = eventList.get(i).getTime_created();
            if (dateEventCreate.after(dateStartSemester) && dateEventCreate.before(dateEndSemester)) {
                if (eventList.get(i).getStudent_events().size() == 1 && eventList.get(i).getStudent_events().get(0).isStudent() == true) {
                    finalListEvent.add(eventList.get(i));
                }
            }
        }
        return finalListEvent;
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
    public boolean updateEvent(Event event) {
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

    @Override
    public EventDTO findEventAndStudentsById(int id) {
        Event event = IEventRepository.findEventById(id);
        List<Student> students = new ArrayList<>();

        List<Student_Event> student_events = iStudent_eventService.findStudentEventByEventId(id);

        for (int i = 0; i < student_events.size(); i++) {
            students.add(student_events.get(i).getStudent());
        }
        EventDTO eventDTO = new EventDTO();
        eventDTO.setEvent(event);
        eventDTO.setStudentList(students);

        if (eventDTO != null) {
            event.setRead(true);
            IEventRepository.save(event);
            return eventDTO;
        }
        return null;
    }
}
