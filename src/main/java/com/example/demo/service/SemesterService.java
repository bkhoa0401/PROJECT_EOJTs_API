package com.example.demo.service;

import com.example.demo.entity.Semester;
import com.example.demo.repository.SemesterRepository;
import com.example.demo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SemesterService {

    @Autowired
    SemesterRepository semesterRepository;


    public Semester getSemesterByName(String name) {
        Semester semester = semesterRepository.findSemesterByName(name);
        if (semester != null) {
            return semester;
        }
        return null;
    }

    public List<Semester> getAllSemester() {
        List<Semester> semesters = semesterRepository.findAll();
        if (semesters != null) {
            return semesters;
        }
        return null;
    }

    public Semester getSemesterCurrent(){
        List<Semester> semesters = getAllSemester();
        Semester semesterCurrent=new Semester();

        for (int i = 0; i < semesters.size(); i++) {
            String minDate = semesters.get(i).getFinish_choose_option_time().toString();
            String maxDate = semesters.get(i).getEnd_date().toString();
            boolean getCurrentSemester = Utils.aDateBetweenTwoDate(minDate, maxDate);
            if (getCurrentSemester == true) {
                semesterCurrent = semesters.get(i);
                break;
            }
        }
        return semesterCurrent;

    }
}
