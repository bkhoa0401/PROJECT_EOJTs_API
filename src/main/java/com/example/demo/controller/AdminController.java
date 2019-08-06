package com.example.demo.controller;

import com.example.demo.dto.*;

import com.example.demo.entity.*;
import com.example.demo.service.*;
import com.nimbusds.jwt.JWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    IStudentService studentService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IEventService eventService;

    @Autowired
    IUsersService usersService;

    @Autowired
    IAdminService adminService;

    @Autowired
    IBusinessService businessService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IQuestionService iQuestionService;

    @Autowired
    IStudent_EventService iStudent_eventService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<Student>> getAllStudentByTypeStatusOption(@RequestParam int typeOfStatus) {
        List<Student> studentList = studentService.getAllStudentByStatusOption(typeOfStatus);
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping
    public ResponseEntity<Void> updateStudentToBusinessPassOption1OrOption2() {
        List<Student> studentListPassOnlyOption1 = studentService.getAllStudentByStatusOption(1); // only pass nv1
        List<Student> studentListPassOnlyOption2 = studentService.getAllStudentByStatusOption(2); // only pass nv2
        List<Student> studentListPassAllOption = studentService.getAllStudentByStatusOption(3); // pass 2 nv

        List<Student> listTotalStudentPassOnlyOption1OrOption2AndAll = new ArrayList<>();
        listTotalStudentPassOnlyOption1OrOption2AndAll.addAll(studentListPassOnlyOption1);
        listTotalStudentPassOnlyOption1OrOption2AndAll.addAll(studentListPassOnlyOption2);
        listTotalStudentPassOnlyOption1OrOption2AndAll.addAll(studentListPassAllOption);

        ojt_enrollmentService.updateStudentToBusinessPassOption1OrOption2(listTotalStudentPassOnlyOption1OrOption2AndAll);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getCurrentUser")
    @ResponseBody
    public ResponseEntity<Admin> getCurrentUser() {
        String email = getEmailFromToken();
        Admin admin = adminService.findAdminByEmail(email);
        if (admin != null) {
            return new ResponseEntity<Admin>(admin, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/updateAdmin")
    public ResponseEntity<Void> updateAdmin(@RequestBody Admin profile) {
        Admin admin = adminService.findAdminByEmail(profile.getEmail());
        admin.setPhone(profile.getPhone());
        admin.setLogo(profile.getLogo());
        admin.setName(profile.getName());
        admin.setAddress(profile.getAddress());
        boolean update = adminService.updateAdmin(admin);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get all student to send inform message
    //check semester //ok
    @GetMapping("/students")
    @ResponseBody
    public ResponseEntity<List<Student>> getAllStudentToSendInform() {
        // List<Student> studentList = studentService.getAllStudents();
        List<Student> studentList = studentService.getAllStudentsBySemesterId();
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    //get all events of admin
    //check semester ok
    @GetMapping("/events")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfAdminSent() {
        String email = getEmailFromToken();
        List<Event> events = eventService.getEventListOfAdmin(email);
        List<Event> finalAdminListEvent = eventService.getEventListSent(events);
        Collections.sort(finalAdminListEvent);
        List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalAdminListEvent);
        if (eventDTOList != null) {
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/eventsReceived")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfAdminReceived() {
        String email = getEmailFromToken();
        List<Event> adminReceivedEvents = eventService.getEventListOfAdmin(email);
        List<Event> finalListEvent = eventService.getEventListReceived(adminReceivedEvents);
        Collections.sort(finalListEvent);
        List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalListEvent);
        if (eventDTOList != null) {
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/eventsReceivedNotRead")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfAdminReceivedNotRead() {
        String email = getEmailFromToken();
        List<Event> adminReceivedEvents = eventService.getEventListOfAdmin(email);
        List<Event> finalListEvent = eventService.getEventListReceived(adminReceivedEvents);
        List<Event> finalListEventNotRead = eventService.getEventListNotRead(finalListEvent);
        Collections.sort(finalListEventNotRead);
        List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalListEventNotRead);
        if (eventDTOList != null) {
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/eventsReceivedRead")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfAdminReceivedRead() {
        String email = getEmailFromToken();
        List<Event> adminReceivedEvents = eventService.getEventListOfAdmin(email);
        List<Event> finalListEvent = eventService.getEventListReceived(adminReceivedEvents);
        List<Event> finalListEventRead = eventService.getEventListRead(finalListEvent);
        Collections.sort(finalListEventRead);
        List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalListEventRead);
        if (eventDTOList != null) {
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PostMapping("/event")
    public ResponseEntity<Void> createEvent(@RequestParam List<String> listStudentEmail, @RequestBody Event event) {
        String email = getEmailFromToken();
        Users users = usersService.findUserByEmail(email);

        List<Role> roleListUsers = users.getRoles();

        for (int i = 0; i < roleListUsers.size(); i++) {
            int roleId = roleListUsers.get(i).getId();
            if (roleId == 1) {
                Admin admin = adminService.findAdminByEmail(email);
                event.setAdmin(admin);
            } else if (roleId == 3) {
                Business business = businessService.getBusinessByEmail(email);
                event.setBusiness(business);
            }
        }
        List<Student> studentList = new ArrayList<>();
        for (int i = 0; i < listStudentEmail.size(); i++) {
            Student student = studentService.getStudentByEmail(listStudentEmail.get(i));
            studentList.add(student);
        }
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        event.setTime_created(date);
        //event.setStudents(studentList);
        boolean create = eventService.createEvent(event);

        for (int i = 0; i < studentList.size(); i++) {
            Student student=studentList.get(i);
            Student_Event student_event = new Student_Event();
            student_event.setStudent(student);
            student_event.setEvent(event);
            student_event.setStudent(false);

            iStudent_eventService.saveStudentEvent(student_event);
        }
        if (create == true) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    @GetMapping("/jobPostsBusinesses")
    @ResponseBody
    public ResponseEntity<List<Business_ListJobPostDTO>> getJobPostsOfBusinesses() {
        List<Business_ListJobPostDTO> business_listJobPostDTOS = adminService.getJobPostsOfBusinesses();

        if (business_listJobPostDTOS != null) {
            return new ResponseEntity<List<Business_ListJobPostDTO>>(business_listJobPostDTOS, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get email from token
    private String getEmailFromToken() {
        String email = "";
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return email;
    }

    //Not doing anything from this//get suggested business for student
    @GetMapping("/getSuggestedBusinessForFail")
    @ResponseBody
    private ResponseEntity<List<Business>> getSuggestedBusinessForFail(@RequestParam String email) {
        Student suggestStudent = studentService.getStudentByEmail(email);
        List<Business> listSuggestBusiness = adminService.getSuggestedBusinessListForFail(suggestStudent);
        if (listSuggestBusiness != null) {
            return new ResponseEntity<List<Business>>(listSuggestBusiness, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get business has job_post in specific specialized
    @GetMapping("/getOtherBusiness")
    @ResponseBody
    private ResponseEntity<List<Business>> getOtherBusiness(@RequestParam String email) {
        Student suggestStudent = studentService.getStudentByEmail(email);
        List<Business> listBusiness = businessService.getAllBusinessBySemester();
        List<Business> listSuggestBusiness = adminService.getSuggestedBusinessListForFail(suggestStudent);
        List<Business> listOtherBusiness = new ArrayList<>();
        List<String> listNameBusiness = new ArrayList<>();
        for (int i = 0; i < listSuggestBusiness.size(); i++) {
            listNameBusiness.add(listSuggestBusiness.get(i).getBusiness_eng_name());
        }
        for (int i = 0; i < listBusiness.size(); i++) {
            if (!listBusiness.get(i).getBusiness_eng_name().equals(suggestStudent.getOption1()) &&
                    !listBusiness.get(i).getBusiness_eng_name().equals(suggestStudent.getOption2()) &&
                    !listNameBusiness.contains(listBusiness.get(i).getBusiness_eng_name())) {
                listOtherBusiness.add(listBusiness.get(i));
            }
        }
        List<Business> finalList = adminService.filterListBusinessByStudentSpecialized(suggestStudent.getSpecialized().getId(), listOtherBusiness);
        if (finalList != null) {
            return new ResponseEntity<List<Business>>(finalList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    //set business for student by student id
    @PutMapping("/setBusinessForStudent")
    public ResponseEntity<Void> setBusinessForStudent(@RequestParam String emailOfBusiness, @RequestParam String emailOfStudent) {
        boolean setStatus = ojt_enrollmentService.setBusinessForStudent(emailOfBusiness, emailOfStudent);
        if (setStatus == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/studentOptionPerBusiness")
    @ResponseBody
    public ResponseEntity<Businesses_OptionsDTO> getStudentOptionPerBusiness() {
        Businesses_OptionsDTO businesses_optionsDTO = adminService.getBusinesses_OptionDTO();

        if (businesses_optionsDTO != null) {
            return new ResponseEntity<>(businesses_optionsDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //dem so luong hs thuc tap tai 1 dn
    @GetMapping("/business-students")
    @ResponseBody
    public ResponseEntity<Businesses_StudentsDTO> countStudentAtABusiness() {
        Businesses_StudentsDTO businesses_studentsDTO = adminService.getBusinesses_StudentsDTO();
        if (businesses_studentsDTO != null) {
            return new ResponseEntity<Businesses_StudentsDTO>(businesses_studentsDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/statisticalEvaluations")
    @ResponseBody
    public ResponseEntity<List<Statistical_EvaluationDTO>> getStatisticalEvaluation() {
        List<Statistical_EvaluationDTO> statistical_evaluationDTOList = adminService.getListStatistical_EvaluationDTO();
        if (statistical_evaluationDTOList != null) {
            return new ResponseEntity<List<Statistical_EvaluationDTO>>(statistical_evaluationDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/statisticalQuestionAnswer")
    @ResponseBody
    public ResponseEntity<List<StatisticalQuestionAnswerDTO>> getStatisticalQuestionAnswer() {
        List<StatisticalQuestionAnswerDTO> statisticalQuestionAnswerDTOS = adminService.getListStatisticalQuestionAnswerDTO();
        if (statisticalQuestionAnswerDTOS != null) {
            return new ResponseEntity<List<StatisticalQuestionAnswerDTO>>(statisticalQuestionAnswerDTOS, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/statisticalStudentIsAnswer")
    @ResponseBody
    public ResponseEntity<List<Integer>> getStatisticalStudentIsAnswer() {
        List<Integer> statisticalStudentIsAnswer = adminService.percentStudentMakeSurvey();
        if (statisticalStudentIsAnswer != null) {
            return new ResponseEntity<List<Integer>>(statisticalStudentIsAnswer, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //thống kê số lượng sinh viên set nguyện vọng vào công ty qua các kì
    @GetMapping("/businessOptionsBySemester")
    @ResponseBody
    public ResponseEntity<BusinessOptionsBySemesterDTO> getBusinessOptionsBySemester() {
        String email = getEmailFromToken();

        BusinessOptionsBySemesterDTO businessOptionsBySemesterDTO = adminService.getBusinessOptionsBySemester(email);

        if (businessOptionsBySemesterDTO != null) {
            return new ResponseEntity<>(businessOptionsBySemesterDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    // thống kê số lượng sinh viên đc nhận thực tập tại doanh nghiệp qua các kì
    @GetMapping("/studentInternAtBusiness")
    @ResponseBody
    public ResponseEntity<BusinessOptionsBySemesterDTO> countStudentInternAtBusinessBySemester() {
        String email = getEmailFromToken();
        BusinessOptionsBySemesterDTO countStudent = adminService.countStudentInternAtBusinessBySemester(email);

        if (countStudent != null) {
            return new ResponseEntity<>(countStudent, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //thống kê đánh giá các report của sinh viên thực tập tại doanh nghiệp
    @GetMapping("/statisticalEvaluationsBusiness")
    @ResponseBody
    public ResponseEntity<List<Statistical_EvaluationDTO>> getListStatistical_EvaluationDTOOfABusiness() {
        String email = getEmailFromToken();

        List<Statistical_EvaluationDTO> evaluationDTOs = adminService.getListStatistical_EvaluationDTOOfABusiness(email);

        if (evaluationDTOs != null) {
            return new ResponseEntity<List<Statistical_EvaluationDTO>>(evaluationDTOs, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    //thống kê tỉ lệ về trạng thái task của sinh viên trong 1 doanh nghiệp
    @GetMapping("/numberStatusTaskStudent")
    @ResponseBody
    public ResponseEntity<List<MonthNumberTaskDTO>> numberStatusTaskOfStudent() {
        String email = getEmailFromToken();

        Business business = businessService.getBusinessByEmail(email);

        List<MonthNumberTaskDTO> numberStatus = adminService.numberTaskOfStudent(business);
        if (numberStatus != null) {
            return new ResponseEntity<List<MonthNumberTaskDTO>>(numberStatus, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/studentsTasks")
    @ResponseBody
    public ResponseEntity<Students_TasksDTO> getStudentsTasks() {
        String email = getEmailFromToken();

        Students_TasksDTO students_tasksDTO = adminService.getStudentsAndTasksOfSupervisor(email);
        if (students_tasksDTO != null) {
            return new ResponseEntity<Students_TasksDTO>(students_tasksDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/studentsTasksDone")
    @ResponseBody
    public ResponseEntity<Students_TasksDoneDTO> getStudentsTasksDone() {
        String email = getEmailFromToken();

        Students_TasksDoneDTO students_tasksDoneDTO = adminService.getStudentAndTasksDoneOfSupervisor(email);
        if (students_tasksDoneDTO != null) {
            return new ResponseEntity<Students_TasksDoneDTO>(students_tasksDoneDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/statisticalEvaluationOfSupervisor")
    @ResponseBody
    public ResponseEntity<List<Statistical_EvaluationDTO>> getStatistical_EvaluationDTOSBySupervisor() {
        String email = getEmailFromToken();

        List<Statistical_EvaluationDTO> evaluationDTOS = adminService.getListStatistical_EvaluationOfSupervisorDTO(email);
        if (evaluationDTOS != null) {
            return new ResponseEntity<List<Statistical_EvaluationDTO>>(evaluationDTOS, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    @GetMapping("/statisticalStudentInSemester")
    @ResponseBody
    public ResponseEntity<StatisticalStudentInSemesterDTO> getStatisticalStudentInSemester(@RequestParam String semesterName) {
        StatisticalStudentInSemesterDTO statisticalStudentInSemesterDTO =
                adminService.getStatisticalStudentInSemester(semesterName);
        if (statisticalStudentInSemesterDTO != null) {
            return new ResponseEntity<StatisticalStudentInSemesterDTO>(statisticalStudentInSemesterDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PostMapping("/question")
    public ResponseEntity<Void> createNewQuestion(@RequestBody Question question) {
        if (question == null) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        iQuestionService.addNewQuestion(question);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/questions")
    @ResponseBody
    public ResponseEntity<List<Question>> getAllQuestion() {
        List<Question> questions = iQuestionService.getAllQuestionNotCareStatus();
        if (questions != null) {
            return new ResponseEntity<List<Question>>(questions, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/question/id")
    @ResponseBody
    public ResponseEntity<Question> getQuestionById(@RequestParam int id) {
        Question question = iQuestionService.findQuestionById(id);
        if (question != null) {
            return new ResponseEntity<Question>(question, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping("/question")
    public ResponseEntity<Void> deleteQuestion(@RequestParam int id, @RequestParam boolean status) {
        iQuestionService.deleteQuestion(id, status);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/question-content")
    public ResponseEntity<Void> updateQuestion(@RequestBody Question question) {
        iQuestionService.updateQuestion(question);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/checkSemester")
    @ResponseBody
    private ResponseEntity<Boolean> checkSemesterExisted(@RequestParam String semesterName) {
        boolean isExisted = false;
        List<Semester> semesterList = semesterService.getAllSemester();
        for (int i = 0; i < semesterList.size(); i++) {
            if (semesterList.get(i).getName().equals(semesterName)) {
                isExisted = true;
                break;
            }
        }
        return new ResponseEntity<Boolean>(isExisted, HttpStatus.OK);
    }

    @GetMapping("/getSemesterByName")
    @ResponseBody
    public ResponseEntity<Semester> getSemesterByName(@RequestParam String semesterName) {
        Semester semester = semesterService.getSemesterByName(semesterName);
        if (semester != null) {
            return new ResponseEntity<Semester>(semester, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PostMapping("/saveSemester")
    public ResponseEntity<Semester> saveParameter(@RequestBody Semester ScheduleParameters) {
        boolean save = semesterService.saveSemester(ScheduleParameters);
        if (save == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getAllSemester")
    @ResponseBody
    public ResponseEntity<List<Semester>> getAllSemester() {
        List<Semester> semesterList = semesterService.getAllSemester();
        if (semesterList != null) {
            return new ResponseEntity<>(semesterList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
