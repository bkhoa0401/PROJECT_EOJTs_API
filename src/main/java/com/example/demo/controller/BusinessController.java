package com.example.demo.controller;

import com.example.demo.config.Sms;
import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PersistenceException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/business")
public class BusinessController {
    @Autowired
    private BusinessService businessService;

    @Autowired
    private Ojt_EnrollmentService ojt_enrollmentService;

    @Autowired
    private BusinessImportFileService businessImportFileService;

    @Autowired
    SkillService skillService;

    @Autowired
    InvitationService invitationService;

    @Autowired
    Job_PostService job_postService;

    @Autowired
    StudentService studentService;

    @Autowired
    SupervisorService supervisorService;

    @Autowired
    UsersService usersService;

    @Autowired
    Job_Post_SkillService job_post_skillService;

    @Autowired
    EventService eventService;

    @Autowired
    EvaluationService evaluationService;

    @Autowired
    SemesterService semesterService;

    private final Logger LOG = LoggerFactory.getLogger(getClass());

    @PostMapping("")
    public ResponseEntity<Void> saveBusiness(@RequestBody List<BusinessDTO> listBusinessDTO) throws Exception {
        for (int i = 0; i < listBusinessDTO.size(); i++) {
            for (int j = 0; j < listBusinessDTO.get(i).getSkillDTOList().size(); j++) {
                String skill_name = "";
                int skill_id = 0;
                Skill skill = new Skill();

                skill_name = listBusinessDTO.get(i).getSkillDTOList().get(j).getName();
                skill_id = skillService.fullTextSearch(skill_name);
                skill.setId(skill_id);
                listBusinessDTO.get(i).getSkillDTOList().get(j).setSkill(skill);
            }
        }
        for (int i = 0; i < listBusinessDTO.size(); i++) {
            businessImportFileService.insertBusiness(listBusinessDTO.get(i));
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //check semester //ok
    @PostMapping("/new")
    public ResponseEntity<Void> createNewBusiness(@RequestBody Business business) throws Exception {

        List<Role> roleList = new ArrayList<>();
        Role role = new Role();
        Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
        List<Ojt_Enrollment> ojtEnrollmentList = new ArrayList<>();
        Users users = new Users();
        String password = usersService.getAlphaNumericString();

        role.setId(3);
        roleList.add(role);
        users.setRoles(roleList);
        users.setEmail(business.getEmail());
        users.setPassword(password);
        users.setActive(true);

        Semester semester = semesterService.getSemesterCurrent();

        ojt_enrollment.setBusiness(business);
        ojt_enrollment.setSemester(semester);
        ojtEnrollmentList.add(ojt_enrollment);
        business.setOjt_enrollments(ojtEnrollmentList);

        try {
            businessService.saveBusiness(business);
            usersService.saveUser(users);

            if (usersService.saveUser(users)) {
                usersService.sendEmail(business.getBusiness_name(), users.getEmail(), users.getPassword());
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

    //check semester //ok
    @GetMapping("/getAllBusiness")
    @ResponseBody
    public ResponseEntity<List<Business>> getAllBusiness() {
        //List<Business> businessList = businessService.getAllBusiness();
        List<Business> businessList = businessService.getAllBusinessBySemester();
        if (businessList != null) {
            return new ResponseEntity<List<Business>>(businessList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getBusiness")
    @ResponseBody
    public ResponseEntity<Business> getBusinessByEmail() {
        String email = getEmailFromToken();
        Business business = businessService.getBusinessByEmail(email);
        if (business != null) {
            return new ResponseEntity<Business>(business, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/business")
    @ResponseBody
    public ResponseEntity<Business> getBusinessByEmail(@RequestParam String email) {
        Business business = businessService.getBusinessByEmail(email);
        if (business != null) {
            return new ResponseEntity<Business>(business, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //update business
    @PutMapping("/updateBusiness")
    public ResponseEntity<Void> updateBusinessByEmail(@RequestBody Business business) {
        String email = getEmailFromToken();
        boolean update = businessService.updateBusiness(email, business);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //list invitaion of busines
    @GetMapping("/listInvitation")
    @ResponseBody
    public ResponseEntity<List<Invitation>> getListInvitation() {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByBusinessEmail(email);
        if (invitationList != null) {
            return new ResponseEntity<List<Invitation>>(invitationList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //business get details invitation
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


    //get job post details by id
    @GetMapping("/getJobPost")
    @ResponseBody
    public ResponseEntity<Job_PostDTO> getJobPost(@RequestParam int id) {

        Job_Post job_post = job_postService.findJob_PostById(id);
        String emailOfBusiness = job_post.getOjt_enrollment().getBusiness().getEmail();
        Business business = businessService.getBusinessByEmail(emailOfBusiness);

        Job_PostDTO job_postDTO = new Job_PostDTO();
        job_postDTO.setJob_post(job_post);
        job_postDTO.setBusiness(business);

        if (job_post != null) {
            return new ResponseEntity<Job_PostDTO>(job_postDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //get all post of all business
    //check semester //ok
    @GetMapping("/getAllJobPostOfBusiness")
    @ResponseBody
    public ResponseEntity<List<Business_JobPostDTO>> getAllJobPostBusiness() {
        LOG.info("Getting all job post");
        List<Business_JobPostDTO> business_jobPostDTOList = businessService.getAllJobPostOfBusinesses();
        if (business_jobPostDTOList == null) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<List<Business_JobPostDTO>>(business_jobPostDTOList, HttpStatus.OK);
    }

    //check semester ok
    // create an invitation
    @PostMapping("/createInvitation")
    public ResponseEntity<Void> createInvitationForStudent(@RequestBody Invitation invitation
            , @RequestParam String emailStudent) {
        String emailBusiness = getEmailFromToken();
        Business business = businessService.getBusinessByEmail(emailBusiness);

        Student student = studentService.getStudentByEmail(emailStudent);

        invitation.setStudent(student);
        invitation.setBusiness(business);
        invitationService.createInvitation(invitation);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // update status of option student when interview
    @PutMapping("/updateStatusOfStudent")
    public ResponseEntity<Void> updateStatusOfOptionStudent(@RequestParam List<Integer> numberOfOption, @RequestParam boolean statusOfOption
            , @RequestParam String emailOfStudent) {
        boolean updateStatus = studentService.updateStatusOptionOfStudent(numberOfOption, statusOfOption, emailOfStudent);
        if (updateStatus == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //update info job post
    //check semester //ok
    @PutMapping("/updateJobPost")
    public ResponseEntity<Void> updateJobPostOfBusiness(@RequestBody Job_Post job_post) {
        String businessEmail = getEmailFromToken();

        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessEmail, semesterCurrent.getId());
        job_post.setOjt_enrollment(ojt_enrollment);


        List<Job_Post_Skill> job_post_skills = job_post.getJob_post_skills();
        for (int i = 0; i < job_post_skills.size(); i++) {
            Job_Post_Skill job_post_skill = job_post_skills.get(i);
            job_post_skill.setJob_post(job_post);
            job_post_skillService.updateJobPostSkill(job_post_skill);
        }

        boolean updateJobPost = job_postService.updateInforJobPost(job_post);
        if (updateJobPost == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    //get ds chinh thuc cua cong ty
    @GetMapping("/getStudentsByBusiness")
    @ResponseBody
    public ResponseEntity<List<Student>> getListStudentByBusiness() {
        String emailBusiness = getEmailFromToken();
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(emailBusiness);

        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //upload link transcript
    @PutMapping("/updateLinkTranscript")
    public ResponseEntity<Void> updateLinkTranscript(@RequestBody Student student) {
        boolean updateLinkTranscript = studentService.updateLinkTranscriptForStudent(student);
        if (updateLinkTranscript == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get top 5 business
    @GetMapping("/getTop5Business")
    @ResponseBody
    public ResponseEntity<List<Business>> getTop5Business() {
        List<Business> businessList = businessService.findTop5BusinessByRateAverage();
        if (businessList != null) {
            return new ResponseEntity<List<Business>>(businessList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    //get all job post of a business for student
    @GetMapping("/getAllJobPostABusiness")
    @ResponseBody
    public ResponseEntity<List<Business_JobPostDTO>> getAllJobPostOfABusiness() {
        String businessEmail = getEmailFromToken();

        Business business = businessService.getBusinessByEmail(businessEmail);

        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessEmail, semesterCurrent.getId());

        List<Business_JobPostDTO> business_jobPostDTOList = new ArrayList<>();

        Business_JobPostDTO business_jobPostDTO = new Business_JobPostDTO();

        List<Job_Post> job_postList = job_postService.getAllJobPostOfBusiness(ojt_enrollment);
        for (int i = 0; i < job_postList.size(); i++) {
            business_jobPostDTO.setBusiness(business);
            business_jobPostDTO.setJob_post(job_postList.get(i));
            business_jobPostDTOList.add(business_jobPostDTO);
            business_jobPostDTO = new Business_JobPostDTO();
        }

        if (job_postList != null) {
            Collections.sort(business_jobPostDTOList);
            return new ResponseEntity<List<Business_JobPostDTO>>(business_jobPostDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester // ok
    //get all supervisor of business
    @GetMapping("/getAllSupervisorABusiness")
    @ResponseBody
    public ResponseEntity<List<Supervisor>> getSupervisorOfABusiness() {
        String email = getEmailFromToken();

        List<Supervisor> supervisors = supervisorService.getAllSupervisorOfABusiness(email);
        if (supervisors != null) {
            return new ResponseEntity<List<Supervisor>>(supervisors, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    // create a supervisor
    @PostMapping("/createSupervisor")
    public ResponseEntity<Void> createSupervisor(@RequestBody Supervisor supervisor) {
        String email = getEmailFromToken();
        boolean result = false;

        result = supervisorService.createSupervisor(supervisor, email);
        if (result) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //update state isActive supervisor
    @PutMapping("/updateStatus")
    public ResponseEntity<Void> updateStatusSupervisor(@RequestParam String email, @RequestParam boolean isActive) {
        boolean updateStatus = supervisorService.updateStateSupervisor(email, isActive);
        if (updateStatus == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //assign supervisor for student
    @PutMapping("/assignSupervisor")
    public ResponseEntity<Void> assignSupervisorForStudent(@RequestBody List<Student> studentList) {
        boolean assign = studentService.assignSupervisorForStudent(studentList);
        if (assign == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester ok
    //create job post
    @PostMapping("/createJobPost")
    public ResponseEntity<Void> createJobPost(@RequestBody Job_Post job_post) {
        String emailBusiness = getEmailFromToken();
        boolean create = job_postService.createJob_Post(emailBusiness, job_post);
        if (create == true) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get all events of business
    @GetMapping("/events")
    @ResponseBody
    public ResponseEntity<List<Event>> getAllEventOfBusiness() {
        String email = getEmailFromToken();
        List<Event> events = eventService.getEventListOfBusiness(email);
        if (events != null) {
            Collections.sort(events);
            return new ResponseEntity<List<Event>>(events, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester ok
    @GetMapping("/evaluations")
    @ResponseBody
    public ResponseEntity<List<Evaluation>> getAllEvaluationOfBusiness() {
        String email = getEmailFromToken();

        List<Evaluation> evaluationList = evaluationService.getListEvaluationOfBusiness(email);
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(email);
        List<Evaluation> overviewEvaluationList = new ArrayList<Evaluation>();
        int flag = 0;
        for (int i = 0; i < studentList.size(); i++) {
            flag = 0;
            for (int j = 0; j < evaluationList.size(); j++) {
                if (studentList.get(i).getCode().equals(evaluationList.get(j).getOjt_enrollment().getStudent().getCode())) {
                    overviewEvaluationList.add(evaluationList.get(j));
                    if (flag > 0) {
                        for (int k = 1; k <= flag; k++) {
                            Date date1 = overviewEvaluationList.get(overviewEvaluationList.size() - k).getTimeStart();
                            Date date2 = overviewEvaluationList.get(overviewEvaluationList.size() - 1 - k).getTimeStart();
                            if (date1.before(date2)) {
                                Evaluation tmpEvaluation = overviewEvaluationList.get(overviewEvaluationList.size() - 1 - k);
                                overviewEvaluationList.set(overviewEvaluationList.size() - 1 - k, overviewEvaluationList.get(overviewEvaluationList.size() - k));
                                overviewEvaluationList.set(overviewEvaluationList.size() - k, tmpEvaluation);
                            }
                        }
                    }
                    flag++;
                }
            }
            if (flag < 4) {
                for (int l = flag; l < 4; l++) {
                    overviewEvaluationList.add(null);
                }
            }
        }
        if (overviewEvaluationList != null) {
            return new ResponseEntity<List<Evaluation>>(overviewEvaluationList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    @PostMapping("/sms")
    @ResponseBody
    public ResponseEntity<String> sendSms(@RequestBody SmsDTO smsDTO) {
        Sms sms = new Sms();

        try {
            sms.sendSMS(smsDTO.getReceiverNumber(), smsDTO.getContent(), 2, "EOJTs");
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(HttpStatus.OK);
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
