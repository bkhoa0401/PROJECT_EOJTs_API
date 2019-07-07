package com.example.demo.repository;

import com.example.demo.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event,Integer> {

    @Query("select e from Event e join e.students st where st.email = ?1")
    List<Event> findEventsByStudentEmail(String email);

    List<Event> findEventsByAdmin_Email(String email);

    List<Event> findEventsByBusinessEmail(String email);
}
