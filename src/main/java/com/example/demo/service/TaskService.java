package com.example.demo.service;

import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Task;
import com.example.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    public void createTaskForStudent(Task task) {
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        task.setTime_created(date);
        taskRepository.save(task);
    }

    public List<Task> findTaskBySupervisorEmail(String email){
        List<Task> taskList= taskRepository.findTasksBySupervisorEmail(email);
        if(taskList!=null){
            return taskList;
        }
        return null;
    }

    public List<Task> findTaskByStudentEmail(String email){
        Ojt_Enrollment ojt_enrollment=ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);
        List<Task> taskList= taskRepository.findTasksByOjt_enrollment(ojt_enrollment);
        if(taskList!=null){
            return taskList;
        }
        return null;
    }
}
