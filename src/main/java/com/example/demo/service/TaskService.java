package com.example.demo.service;

import com.example.demo.config.Status;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Semester;
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

    @Autowired
    SemesterService semesterService;

    public void createTaskForStudent(Task task) {
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        task.setTime_created(date);
        task.setStatus(Status.NOT_START);
        taskRepository.save(task);
    }

    public List<Task> findTaskBySupervisorEmail(String email) {
        List<Task> taskList = taskRepository.findTasksBySupervisorEmail(email);
        if (taskList != null) {
            return taskList;
        }
        return null;
    }

    //check semester //ok
    public List<Task> findTaskByStudentEmail(String email) {
       // Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);
        Semester semesterCurrent=semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment=
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email,semesterCurrent.getId());
        List<Task> taskList = taskRepository.findTasksByOjt_enrollment(ojt_enrollment);
        if (taskList != null) {
            return taskList;
        }
        return null;
    }

    public Task findTaskById(int id) {
        Task task = taskRepository.findById(id);
        if (task != null) {
            return task;
        }
        return null;
    }

    public boolean updateTask(Task task) {
        Task taskIsExisted = taskRepository.findById(task.getId());
        if (taskIsExisted != null) {
//            task.setOjt_enrollment(taskIsExisted.getOjt_enrollment());
            task.setTime_created(taskIsExisted.getTime_created());
            task.setSupervisor(taskIsExisted.getSupervisor());
            taskRepository.save(task);
            return true;
        }
        return false;
    }

    public boolean deleteTask(int id) {
        Task task = taskRepository.findById(id);
        if (task != null) {
            taskRepository.deleteById(task.getId());
            return true;
        }
        return false;
    }

    public boolean updateStatusTask(int id, int typeStatusTask) {
        Task task = findTaskById(id);
        if (task != null) {
            if (typeStatusTask == 2) {
                task.setStatus(Status.PENDING);
            } else if (typeStatusTask == 3) {
                task.setStatus(Status.DONE);
            }
            taskRepository.save(task);
            return true;
        }
        return false;
    }

    public List<Task> findTaskDoneByStudentEmail(String email) {
       // Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);
        Semester semester=semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email,semester.getId());

        List<Task> taskList = taskRepository.findTasksByOjt_enrollmentAndStatusIsDone(ojt_enrollment);
        if (taskList != null) {
            return taskList;
        }
        return null;
    }

    public float getPercentTaskDoneOfStudent(String email) {
        List<Task> taskListOfStudent = findTaskByStudentEmail(email);
        List<Task> taskListDoneOfStudent = findTaskDoneByStudentEmail(email);

        return (float) taskListDoneOfStudent.size() / (float) taskListOfStudent.size();
    }

    public List<Task> findTasksOfStudentByStatus(String email, Status status) {
        Semester semester=semesterService.getSemesterCurrent();
        //Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email,semester.getId());

        List<Task> taskList = taskRepository.findTasksByOjt_enrollmentAndStatus(ojt_enrollment, status);
        if (taskList != null) {
            return taskList;
        }
        return null;
    }
}
