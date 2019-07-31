package com.example.demo.service;

import com.example.demo.entity.Semester;
import com.example.demo.repository.ISemesterRepository;
import com.example.demo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;

@Service
public class SemesterService implements ISemesterService {

    @Autowired
    ISemesterRepository ISemesterRepository;

    @Override
    public Semester getSemesterByName(String name) {
        Semester semester = ISemesterRepository.findSemesterByName(name);
        if (semester != null) {
            return semester;
        }
        return null;
    }

    @Override
    public List<Semester> getAllSemester() {
        List<Semester> semesters = ISemesterRepository.findAll();
        if (semesters != null) {
            return semesters;
        }
        return null;
    }

    @Override
    public Semester getSemesterCurrent() {
        List<Semester> semesters = getAllSemester();
        Semester semesterCurrent = new Semester();

        for (int i = 0; i < semesters.size(); i++) {
            //String minDate = semesters.get(i).getFinish_choose_option_time().toString();
            String minDate = semesters.get(i).getStart_choose_option_time().toString();
            String maxDate = semesters.get(i).getEnd_date().toString();
            boolean getCurrentSemester = Utils.aDateBetweenTwoDate(minDate, maxDate);
            if (getCurrentSemester == true) {
                semesterCurrent = semesters.get(i);
                //        break;
            }
        }
        return semesterCurrent;
    }

    @Override
    public Semester getSemesterCurrentByTimeChooseOption() {

        Date dateCurrent = new Date(Calendar.getInstance().getTime().getTime());

        List<Semester> semesterList = getAllSemester();
        Semester semesterCurrentByOption = new Semester();

        for (int i = 0; i < semesterList.size(); i++) {
            String startChooseOption = semesterList.get(i).getStart_choose_option_time().toString();
            String endChooseOption = semesterList.get(i).getFinish_choose_business_time().toString();
            boolean getCurrentSemester = Utils.aDateBetweenTwoDate(startChooseOption, endChooseOption);
            if (getCurrentSemester == true) {
                semesterCurrentByOption = semesterList.get(i);
                break;
            }
            long getDiff = semesterList.get(i).getStart_choose_option_time().getTime() - dateCurrent.getTime();
            long getDaysDiff = getDiff / (24 * 60 * 60 * 1000);
            if (getDaysDiff >= 0 && getDaysDiff < 8) {
                semesterCurrentByOption = semesterList.get(i);
                break;
            }

            long getDiffAfter = dateCurrent.getTime() - semesterList.get(i).getFinish_choose_option_time().getTime();
            long getDaysDiffAfter = getDiffAfter / (24 * 60 * 60 * 1000);
            if (getDaysDiffAfter >= 0 && getDaysDiffAfter < 8) {
                semesterCurrentByOption = semesterList.get(i);
                break;
            }

        }
        return semesterCurrentByOption;
    }

    @Override
    public Semester getSemesterByStartDateAndEndDate() {
        List<Semester> semesters = getAllSemester();
        Semester semesterByStartDateAndEndDate = new Semester();

        for (int i = 0; i < semesters.size(); i++) {
            String startDate = semesters.get(i).getStart_date().toString();
            String endDate = semesters.get(i).getEnd_date().toString();

            boolean getSemesterByStartDateAndEndDate = Utils.aDateBetweenTwoDate(startDate, endDate);
            if (getSemesterByStartDateAndEndDate == true) {
                semesterByStartDateAndEndDate = semesters.get(i);
                break;
            }
        }
        return semesterByStartDateAndEndDate;
    }
}
