package com.example.demo.service;

import com.example.demo.config.Status;
import com.example.demo.entity.*;
import com.example.demo.repository.ITaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class TaskService implements ITaskService {

    @Autowired
    ITaskRepository ITaskRepository;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISemesterService semesterService;

    @Override
    public void createTaskForStudent(Task task) {
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        task.setTime_created(date);
        task.setStatus(Status.NOTSTART);
        ITaskRepository.save(task);
    }

    @Override
    public List<Task> findTaskBySupervisorEmail(String email) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        List<Task> taskList = ITaskRepository.findTasksBySupervisorEmail(email);
        List<Task> taskListCurrentSemester = new ArrayList<>();

        for (int i = 0; i < taskList.size(); i++) {
            int idSemesterOfTask = taskList.get(i).getOjt_enrollment().getSemester().getId();
            if (idSemesterOfTask == semesterCurrent.getId()) {
                taskListCurrentSemester.add(taskList.get(i));
            }
        }
        if (taskListCurrentSemester != null) {
            return taskListCurrentSemester;
        }
        return null;
    }

    //check semester //ok
    @Override
    public List<Task> findTaskByStudentEmail(String email) {
        // Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semesterCurrent.getId());
        List<Task> taskList = ITaskRepository.findTasksByOjt_enrollment(ojt_enrollment);
        if (taskList != null) {
            return taskList;
        }
        return null;
    }

    @Override
    public Task findTaskById(int id) {
        Task task = ITaskRepository.findById(id);
        if (task != null) {
            return task;
        }
        return null;
    }

    @Override
    public boolean updateTask(Task task) {
        Task taskIsExisted = ITaskRepository.findById(task.getId());
        if (taskIsExisted != null) {
//            task.setOjt_enrollment(taskIsExisted.getOjt_enrollment());
            task.setTime_created(taskIsExisted.getTime_created());
            task.setSupervisor(taskIsExisted.getSupervisor());
            ITaskRepository.save(task);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteTask(int id) {
        Task task = ITaskRepository.findById(id);
        if (task != null) {
            ITaskRepository.deleteById(task.getId());
            return true;
        }
        return false;
    }

    @Override
    public boolean updateStatusTask(int id, int typeStatusTask,String comment) {
        Task task = findTaskById(id);
        if (task != null) {
            if (typeStatusTask == 2) {
                if(comment!=null){
                    task.setStatus(Status.PENDING);
                    task.setComment(comment);
                }
            } else if (typeStatusTask == 3) {
                task.setStatus(Status.DONE);
            }else if(typeStatusTask == 4) {
                task.setComment(comment);
                task.setStatus(Status.APPROVED);
            }
            ITaskRepository.save(task);
            return true;
        }
        return false;
    }

    @Override
    public List<Task> findTaskDoneByStudentEmail(String email) {
        // Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);
        Semester semester = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semester.getId());

        List<Task> taskList = ITaskRepository.findTasksByOjt_enrollmentAndStatusIsDone(ojt_enrollment);
        if (taskList != null) {
            return taskList;
        }
        return null;
    }

    @Override
    public float getPercentTaskDoneOfStudent(String email) {
        List<Task> taskListOfStudent = findTaskByStudentEmail(email);
        List<Task> taskListDoneOfStudent = findTaskDoneByStudentEmail(email);

        return (float) taskListDoneOfStudent.size() / (float) taskListOfStudent.size();
    }

    @Override
    public List<Task> findTasksOfStudentByStatus(String email, Status status) {
        Semester semester = semesterService.getSemesterCurrent();
        //Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semester.getId());

        List<Task> taskList = ITaskRepository.findTasksByOjt_enrollmentAndStatus(ojt_enrollment, status);
        if (taskList != null) {
            return taskList;
        }
        return null;
    }

    @Override
    public List<Task> findTasksOfBusinessAndSemester(Business business) {
        //Semester semester = semesterService.getSemesterByStartDateAndEndDate();
        Semester semester = semesterService.getSemesterCurrent();
        List<Supervisor> supervisors = business.getSupervisors();

        List<Task> taskListOfSupervisor;

        List<Task> taskListResult = new ArrayList<>();

        List<Task> taskListAfterCheckTime=new ArrayList<>();

        for (int i = 0; i < supervisors.size(); i++) {
            taskListOfSupervisor = supervisors.get(i).getTasks();
            for (int j = 0; j < taskListOfSupervisor.size(); j++) {
                boolean checkDate = checkTaskListIsInSemester(semester, taskListOfSupervisor.get(j));
                if (checkDate == true) {
                    taskListAfterCheckTime.add(taskListOfSupervisor.get(j));
                }
            }
            taskListResult.addAll(taskListAfterCheckTime);
        }
        return taskListResult;
    }

    public boolean checkTaskListIsInSemester(Semester semester, Task task) {
        Date dateStart = semester.getStart_date();

        Date dateEnd = semester.getEnd_date();

        Date taskDate = task.getTime_created();

        return taskDate.after(dateStart) && taskDate.before(dateEnd);
    }
}
