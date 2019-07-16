package com.example.demo.controller;

import com.example.demo.config.Status;
import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PersistenceException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    StudentService studentService;

    @Autowired
    UsersService usersService;

    @Autowired
    Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    private SpecializedService specializedService;

    @Autowired
    SkillService skillService;

    @Autowired
    InvitationService invitationService;

    @Autowired
    BusinessService businessService;

    @Autowired
    Job_PostService job_postService;

    @Autowired
    TaskService taskService;

    @Autowired
    EvaluationService evaluationService;

    @Autowired
    EventService eventService;

    @PostMapping
    public ResponseEntity<Void> addListStudent(@RequestBody List<Student> studentList) throws Exception {

        List<Role> roleList = new ArrayList<>();
        Role role = new Role();
        role.setId(2);
        roleList.add(role);
        List<Users> usersList = new ArrayList<>();
        List<Ojt_Enrollment> ojtEnrollmentList = new ArrayList<>();
        List<String> nameList = new ArrayList<>();

        for (int i = 0; i < studentList.size(); i++) {
            Users users = new Users();
            Specialized specialized = new Specialized();
            String specializedName = "";
            int specializedID = 0;

            users.setEmail(studentList.get(i).getEmail());
            String password = usersService.getAlphaNumericString();
            users.setPassword(password);
            nameList.add(studentList.get(i).getName());
            users.setRoles(roleList);
            users.setActive(true);

            specializedName = studentList.get(i).getSpecialized().getName();
            specializedID = specializedService.getIdByName(specializedName);
            specialized.setId(specializedID);
            studentList.get(i).setSpecialized(specialized);

            usersList.add(users);

            Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
            ojt_enrollment.setStudent(studentList.get(i));

            ojtEnrollmentList.add(ojt_enrollment);
        }

        try {
            studentService.saveListStudent(studentList);
            usersService.saveListUser(usersList);
            ojt_enrollmentService.saveListOjtEnrollment(ojtEnrollmentList);

            if (usersService.saveListUser(usersList)) {
                for (int i = 0; i < usersList.size(); i++) {
                    usersService.sendEmail(nameList.get(i), usersList.get(i).getEmail(), usersList.get(i).getPassword());
                }
            }

        } catch (PersistenceException ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/new")
    public ResponseEntity<Void> createNewStudent(@RequestBody Student student) throws Exception {

        List<Role> roleList = new ArrayList<>();
        Role role = new Role();
        Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
        Users users = new Users();
        String password = usersService.getAlphaNumericString();

        role.setId(2);
        roleList.add(role);
        users.setRoles(roleList);
        users.setEmail(student.getEmail());
        users.setPassword(password);
        users.setActive(true);

        ojt_enrollment.setStudent(student);

        try {
            studentService.saveStudent(student);
            usersService.saveUser(users);
            ojt_enrollmentService.saveOjtEnrollment(ojt_enrollment);

            if (usersService.saveUser(users)) {
                usersService.sendEmail(student.getName(), users.getEmail(), users.getPassword());
            }

        } catch (PersistenceException ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/getAllStudent")
    public ResponseEntity<List<Student>> getAllStudents() throws Exception {
        List<Student> studentList = new ArrayList<>();
        try {
            studentList = studentService.getAllStudents();

        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(studentList, HttpStatus.OK);
    }

    //get list skill by specialzed
    @GetMapping("/specialized")
    public ResponseEntity<List<Specialized>> getSpecializedList() {
        List<Specialized> specializedList = specializedService.getAllSpecialized();
        if (specializedList != null) {
            return new ResponseEntity<List<Specialized>>(specializedList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // get list skill by specialized of student
    @GetMapping("/list-skill")
    @ResponseBody
    public ResponseEntity<List<Skill>> getListSkillOfStudentBySpecialized() {
        String email = getEmailFromToken();

        int specializedId = studentService.getSpecializedIdByEmail(email);

        List<Skill> skills = skillService.getListSkillBySpecialized(specializedId);

        if (skills != null) {
            return new ResponseEntity<List<Skill>>(skills, HttpStatus.OK);

        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("student/{email}")
    @ResponseBody
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        return new ResponseEntity<Student>(studentService.getStudentByEmail(email), HttpStatus.OK);
    }


    //update objective
    @PutMapping("/update-resume")
    public ResponseEntity<String> updateInforOfStudent(@RequestParam String objective, @RequestParam float gpa,
                                                       @RequestBody List<Skill> skillList) {
        String email = getEmailFromToken();
        boolean updateInfor = studentService.updateInforStudent(email, objective, gpa, skillList);
        if (updateInfor == false) {
            return new ResponseEntity<String>("fail", HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    //student lay danh sach loi moi cua no
    @GetMapping("/list-invitation")
    @ResponseBody
    public ResponseEntity<List<Invitation>> getListInvitation() {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByStudentEmail(email);
        if (invitationList != null) {
            return new ResponseEntity<List<Invitation>>(invitationList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //student get details invitation
    @GetMapping("/getInvitation")
    @ResponseBody
    public ResponseEntity<Invitation> getInvitation(@RequestParam int id) {
        Invitation invitation = invitationService.getInvitationById(id);
        if (invitation != null) {
            return new ResponseEntity<Invitation>(invitation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //student get job post details by id
    @GetMapping("/getJobPost")
    @ResponseBody
    public ResponseEntity<Job_PostDTO> getListInvitation(@RequestParam int id) {

        Job_Post job_post = job_postService.findJob_PostById(id);
        String emailOfBusiness = job_post.getOjt_enrollment().getBusiness().getEmail();
        Business business = businessService.getBusinessByEmail(emailOfBusiness);

        Job_PostDTO job_postDTO = new Job_PostDTO();
        job_postDTO.setJob_post(job_post);
        job_postDTO.setBusiness(business);

        int view = job_postService.getViewOfJobPost(id);
        job_postService.updateViewOfJobPost(id, ++view);
        if (job_post != null) {
            return new ResponseEntity<Job_PostDTO>(job_postDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //return id of skill
    @GetMapping("/skill")
    @ResponseBody
    public ResponseEntity<Integer> getIdSkillByName(@RequestParam(value = "nameSkill") String nameSkill) {
        System.out.println(nameSkill);
        return new ResponseEntity<Integer>(skillService.fullTextSearch(nameSkill), HttpStatus.OK);
    }

    //update option 1 of student
    @PutMapping("/updateOption1")
    public ResponseEntity<String> updateOption1OfStudent(@RequestParam String option1) {
        String email = getEmailFromToken();
        boolean update = studentService.updateOption1Student(email, option1);
        if (update == true) {
            return new ResponseEntity<String>("success", HttpStatus.OK);
        }
        return new ResponseEntity<String>("fail", HttpStatus.EXPECTATION_FAILED);
    }

    //update option 2 of student
    @PutMapping("/updateOption2")
    public ResponseEntity<String> updateOption2OfStudent(@RequestParam String option2) {
        String email = getEmailFromToken();
        boolean update = studentService.updateOption2Student(email, option2);
        if (update == true) {
            return new ResponseEntity<>("success", HttpStatus.OK);
        }
        return new ResponseEntity<>("fail", HttpStatus.EXPECTATION_FAILED);
    }

    private List<Student> studentListIsInvited = new ArrayList<>();

    //get list student of business invitation
    //get nhung hs ma cty da gui loi moi
    //da fix
    @GetMapping("/getListStudentIsInvited")
    @ResponseBody
    public ResponseEntity<List<Student>> getListStudentOfBusiness() {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByBusinessEmail(email);

        List<Student> studentList = new ArrayList<>();
        for (int i = 0; i < invitationList.size(); i++) {
            Student student = studentService.getStudentIsInvited(invitationList.get(i).getStudent().getEmail());
            studentList.add(student);
        }
        if (studentList != null) {
            studentListIsInvited = studentList;
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //danh sach nhung dua set cong ty vao nguyen vong
    @GetMapping("/getListStudentByOption")
    @ResponseBody
    public ResponseEntity<List<Student>> getListStudentByOptionNameBusiness() {
        String email = getEmailFromToken();

        Business business = businessService.getBusinessByEmail(email);

        List<Student> studentList = studentService.findStudentByBusinessNameOption(business.getBusiness_name(), business.getBusiness_name());
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //danh sach nhung dua set cong ty vao nguyen vong va trang thai cua nv đó
    @GetMapping("/getListStudentByOptionAndStatusOption")
    @ResponseBody
    public ResponseEntity<List<Student>> getListStudentByOptionNameBusinessAndStatusOption() {
        //email of business
        String email = getEmailFromToken();

        Business business = businessService.getBusinessByEmail(email);

        //list student set cty vao nguyen vong
        List<Student> studentList = studentService.findStudentByBusinessNameOption(business.getBusiness_eng_name(), business.getBusiness_eng_name());

        List<Student> listResult = new ArrayList<>();

        String businessName = business.getBusiness_eng_name();

        if (studentList != null) {
            for (int i = 0; i < studentList.size(); i++) {
                if (studentList.get(i).getOption1() == null && studentList.get(i).getOption2() == null) {
                    continue;
                }
                if (studentList.get(i).getOption2() == null) {
                    if (studentList.get(i).getOption1().equals(businessName)) {
                        if (studentList.get(i).isInterviewed1() == false) {
                            listResult.add(studentList.get(i));
                        }
                    }
                }
                if (studentList.get(i).getOption1() == null) {
                    if (studentList.get(i).getOption2().equals(businessName)) {
                        if (studentList.get(i).isInterviewed2() == false) {
                            listResult.add(studentList.get(i));
                        }
                    }
                }
                if (studentList.get(i).getOption1() != null && studentList.get(i).getOption2() != null) {
                    if (studentList.get(i).getOption1().equals(businessName)) {
                        if (studentList.get(i).isInterviewed1() == false) {
                            listResult.add(studentList.get(i));
                        }
                    }
                    if (studentList.get(i).getOption2().equals(businessName)) {
                        if (studentList.get(i).isInterviewed2() == false) {
                            listResult.add(studentList.get(i));
                        }
                    }
                }
            }
        }

        if (listResult != null) {
            return new ResponseEntity<List<Student>>(listResult, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    // lay list student chua duoc moi boi cong ty
    @GetMapping("/getListStudentNotYetInvited")
    @ResponseBody
    public ResponseEntity<List<Student>> getListStudentNotYetInvited() {
        getListStudentOfBusiness();

        List<Student> listStudentIsInvited = studentListIsInvited;
        System.out.println(listStudentIsInvited.size());

        List<Student> listAllStudent = studentService.getAllStudents();

        for (int i = 0; i < listStudentIsInvited.size(); i++) {
            String emailStudentIsInvited = listStudentIsInvited.get(i).getEmail();
            for (int j = 0; j < listAllStudent.size(); j++) {
                String emailStudent = listAllStudent.get(j).getEmail();
                if (emailStudent.equals(emailStudentIsInvited)) {
                    listAllStudent.remove(listAllStudent.get(j));
                    break;
                }
            }
        }
        return new ResponseEntity<List<Student>>(listAllStudent, HttpStatus.OK);
    }

    @PutMapping("/updateToken")
    public ResponseEntity<Void> updateTokenForStudent(@RequestParam String token) {
        String emailStudent = getEmailFromToken();
        boolean updateToken = studentService.updateTokenDeviceForStudent(emailStudent, token);
        if (updateToken == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //student get all job post time post desc
    @GetMapping("/getAllJobPost")
    @ResponseBody
    public ResponseEntity<List<Job_Post>> getAllJobPost() {
        List<Job_Post> job_postList = job_postService.getAllJobPost();
        if (job_postList != null) {
            return new ResponseEntity<List<Job_Post>>(job_postList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //  get Invitation By Business Email And StudentEmail
    @GetMapping("/getInvitationByBusinessEmailAndStudentEmail")
    @ResponseBody
    public ResponseEntity<Invitation> getInvitationByBusinessEmailAndStudentEmail(@RequestParam String businessEmail) {
        String studentEmail = getEmailFromToken();
        Invitation invitation = invitationService.getInvitationByBusinessEmailAndStudentEmail(businessEmail, studentEmail);
        if (invitation != null) {
            return new ResponseEntity<Invitation>(invitation, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getJobPostsSuggest")
    @ResponseBody
    public ResponseEntity<List<Business_JobPostDTO>> getJobPostsSuggest() {
        String email = getEmailFromToken();
        List<Business_JobPostDTO> business_jobPostDTOList = new ArrayList<>();

        List<Job_Post> job_postList = studentService.getSuggestListJobPost(email);
        for (int i = 0; i < job_postList.size(); i++) {
            Business_JobPostDTO business_jobPostDTO = new Business_JobPostDTO();
            business_jobPostDTO.setBusiness(job_postList.get(i).getOjt_enrollment().getBusiness());

            business_jobPostDTO.setJob_post(job_postList.get(i));
//            List<Job_Post> postList = new ArrayList<>();
//            postList.add(job_postList.get(i));
            // sua business_jobPostDTO.setJob_postList(postList);

            business_jobPostDTOList.add(business_jobPostDTO);
        }
        if (business_jobPostDTOList != null) {
            return new ResponseEntity<List<Business_JobPostDTO>>(business_jobPostDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/updateLinkAvatar")
    public ResponseEntity<Void> updateLinkAvatar(@RequestParam String avatar) {
        String email = getEmailFromToken();
        boolean update = studentService.updateLinkAvatar(email, avatar);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/tasks")
    @ResponseBody
    public ResponseEntity<List<Task>> getTasksOfStudent() {
        String email = getEmailFromToken();

        List<Task> taskList = taskService.findTaskByStudentEmail(email);
        if (taskList != null) {
            return new ResponseEntity<List<Task>>(taskList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/evaluations")
    @ResponseBody
    public ResponseEntity<List<Evaluation>> getEvaluationsOfStudent() {
        String email = getEmailFromToken();

        List<Evaluation> evaluationList = evaluationService.getEvaluationsByStudentEmail(email);
        if (evaluationList != null) {
            return new ResponseEntity<List<Evaluation>>(evaluationList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/business")
    @ResponseBody
    public ResponseEntity<Business> getBusinessOfSutdent(@RequestParam String email) {
        Business business = studentService.getBusinessOfStudent(email);
        if (business != null) {
            return new ResponseEntity<Business>(business, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/businesses")
    @ResponseBody
    public ResponseEntity<List<Business>> getBusinessesOfStudent() {
        String email = getEmailFromToken();

        List<Business> businessList = studentService.getBusinessByOptionStudent(email);
        if (businessList != null) {
            return new ResponseEntity<List<Business>>(businessList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/events")
    @ResponseBody
    public ResponseEntity<List<Event>> getEventsOfStudent() {
        String email = getEmailFromToken();

        List<Event> eventList = eventService.getEventList(email);
        if (eventList != null) {
            Collections.sort(eventList);
            return new ResponseEntity<List<Event>>(eventList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/studentsSuggest")
    @ResponseBody
    public ResponseEntity<List<Student>> getListSuggestStudent() {
        getListStudentOfBusiness(); // lay ra nhung dua da moi

        String email = getEmailFromToken();
        List<Student> studentList = businessService.getSuggestListStudent(email);

        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            for (int j = 0; j < studentListIsInvited.size(); j++) {
                Student studentIsInvited = studentListIsInvited.get(j);
                if (student.getEmail().equals(studentIsInvited.getEmail())) {
                    studentList.remove(student); // xoa dua da duoc moi ra khoi list suggest
                }
            }
        }
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/stateInvitation")
    public ResponseEntity<Void> setInvitationForOption(@RequestParam int id,
                                                       @RequestParam int numberOfOption) {
        String studentEmail = getEmailFromToken();
        Invitation invitation = invitationService.getInvitationById(id);
        if (numberOfOption == 1) {
            String businessEngName = invitation.getBusiness().getBusiness_eng_name();
            studentService.updateOption1Student(studentEmail, businessEngName);
            invitationService.updateStateOfInvitation(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } else if (numberOfOption == 2) {
            String businessEngName = invitation.getBusiness().getBusiness_eng_name();
            studentService.updateOption2Student(studentEmail, businessEngName);
            invitationService.updateStateOfInvitation(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //set doanh nghiep thuc tap cho student
    @PutMapping("/businessInternship")
    public ResponseEntity<Void> setBusinessInternshipForStudent(@RequestParam String emailBusiness) {
        String emailStudent = getEmailFromToken();
        ojt_enrollmentService.updateBusinessForStudent(emailBusiness, emailStudent);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboardOfStudent() {
        String email = getEmailFromToken();

        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);

        DashboardDTO dashboardDTO = new DashboardDTO();

        float percentTaskDoneOfStudent = taskService.getPercentTaskDoneOfStudent(email);
        if (!Float.isNaN(percentTaskDoneOfStudent)) {
            dashboardDTO.setPercentTaskDone(percentTaskDoneOfStudent * 100);
        } else {
            dashboardDTO.setPercentTaskDone(0);
        }

        int countEvaluation = evaluationService.countEvaluation(email);
        dashboardDTO.setCountEvaluation(countEvaluation);

        int countEventIsNotRead = eventService.countEventIsNotRead(email);
        dashboardDTO.setInformMessageIsNotRead(countEventIsNotRead);

        dashboardDTO.setBusiness(ojt_enrollment.getBusiness());

        return new ResponseEntity<DashboardDTO>(dashboardDTO, HttpStatus.OK);
    }

    @PutMapping("/rate")
    public ResponseEntity<Void> updateRateForBusinessByStudent(@RequestParam int rate) {
        String email = getEmailFromToken();
        businessService.updateRateNumber(email, rate);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/event")
    @ResponseBody
    public ResponseEntity<Event> getDetailsEvent(@RequestParam int id) {
        Event event = eventService.findEventById(id);
        return new ResponseEntity<Event>(event, HttpStatus.OK);
    }

    @PutMapping("/taskStatus")
    public ResponseEntity<Void> updateTaskStatus(@RequestParam int id, @RequestParam int typeStatus) {
        taskService.updateStatusTask(id, typeStatus);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/evaluation")
    @ResponseBody
    public ResponseEntity<Evaluation> getEvaluationById(@RequestParam int id) {
        Evaluation evaluation = evaluationService.getEvaluationById(id);
        return new ResponseEntity<Evaluation>(evaluation, HttpStatus.OK);
    }

    @PutMapping("/information")
    public ResponseEntity<Void> updateInformationStudent(@RequestParam String name, @RequestParam String phone,
                                                         @RequestParam boolean gender, @RequestParam String address,
                                                         @RequestParam String birthDate) throws ParseException {
        String email = getEmailFromToken();
        boolean update = studentService.updateInformationStudent(email, name, phone, gender, address, birthDate);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);

    }

    @PutMapping("/statusEvent")
    public ResponseEntity<Void> updateStatusEvent(@RequestParam int id) {
        boolean update = eventService.updateStatusIsRead(id);
        if (update) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/taskByStatus")
    @ResponseBody
    public ResponseEntity<List<Task>> getTaskListByStatus(@RequestParam int type) {
        String email = getEmailFromToken();

        List<Task> taskList = new ArrayList<>();
        if (type == 1) {
            taskList = taskService.findTasksOfStudentByStatus(email, Status.NOTSTART);
        } else if (type == 2) {
            taskList = taskService.findTasksOfStudentByStatus(email, Status.PENDING);
        } else if (type == 3) {
            taskList = taskService.findTasksOfStudentByStatus(email, Status.DONE);
        }
        if (taskList != null) {
            return new ResponseEntity<List<Task>>(taskList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/studentsEvaluations")
    @ResponseBody
    public ResponseEntity<List<Student_EvaluationDTO>> getEvaluationsOfStudents() {
        List<Student> studentList = studentService.getAllStudents();

        List<Student_EvaluationDTO> student_evaluationDTOS = new ArrayList<>();

        for (int i = 0; i < studentList.size(); i++) {
            List<Evaluation> evaluationList = evaluationService.getEvaluationsByStudentEmail(studentList.get(i).getEmail());
            Collections.sort(evaluationList);
            if (evaluationList.size() < 4) {
                for (int j = evaluationList.size(); j < 4; j++) {
                    evaluationList.add(null);
                }
            }
            Student_EvaluationDTO student_evaluationDTO = new Student_EvaluationDTO();
            student_evaluationDTO.setEvaluationList(evaluationList);
            student_evaluationDTO.setStudent(studentList.get(i));

            student_evaluationDTOS.add(student_evaluationDTO);
        }

        if (student_evaluationDTOS != null) {
            return new ResponseEntity<List<Student_EvaluationDTO>>(student_evaluationDTOS, HttpStatus.OK);
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

}
