package com.example.demo.controller;

import com.example.demo.dto.BusinessDTO;
import com.example.demo.dto.Business_JobPostDTO;
import com.example.demo.dto.Job_PostDTO;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PersistenceException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

        ojt_enrollment.setBusiness(business);
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

    @GetMapping("/getAllBusiness")
    @ResponseBody
    public ResponseEntity<List<Business>> getAllBusiness() {
        List<Business> businessList = businessService.getAllBusiness();
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
    public ResponseEntity<Job_PostDTO> getListInvitation(@RequestParam int id) {

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
    @GetMapping("/getAllJobPostOfBusiness")
    @ResponseBody
    public ResponseEntity<List<Business_JobPostDTO>> getAllJobPostBusiness() {
        List<Business> businessList = businessService.getAllBusiness();
        List<Business_JobPostDTO> business_jobPostDTOS = new ArrayList<>();
        for (int i = 0; i < businessList.size(); i++) {
            Business_JobPostDTO business_jobPostDTO = new Business_JobPostDTO();
            business_jobPostDTO.setBusiness(businessList.get(i));

            //get instance ojt_enrollments
            Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_enrollmentOfBusiness(businessList.get(i));
            business_jobPostDTO.setJob_postList(ojt_enrollment.getJob_posts());

            business_jobPostDTOS.add(business_jobPostDTO);
        }

        return new ResponseEntity<List<Business_JobPostDTO>>(business_jobPostDTOS, HttpStatus.OK);
    }


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
    public ResponseEntity<Void> updateStatusOfOptionStudent(@RequestParam int numberOfOption, @RequestParam boolean statusOfOption
            , @RequestParam String emailOfStudent) {
        boolean updateStatus = studentService.updateStatusOptionOfStudent(numberOfOption, statusOfOption, emailOfStudent);
        if (updateStatus == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //update infor job post
    @PutMapping("/updateJobPost")
    public ResponseEntity<Void> updateJobPostOfBusiness(@RequestBody Job_Post job_post) {
        boolean updateJobPost = job_postService.updateInforJobPost(job_post);
        if (updateJobPost == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

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

    @PutMapping("/updateLinkTranscript")
    public ResponseEntity<Void> updateLinkTranscript(@RequestBody Student student) {
        boolean updateLinkTranscript = studentService.updateLinkTranscriptForStudent(student);
        if (updateLinkTranscript == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getTop5Business")
    @ResponseBody
    public ResponseEntity<List<Business>> getTop5Business() {
        List<Business> businessList = businessService.findTop5BusinessByRateAverage();
        if (businessList != null) {
            return new ResponseEntity<List<Business>>(businessList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get all job post of a business
    @GetMapping("/getAllJobPostABusiness")
    @ResponseBody
    public ResponseEntity<Business_JobPostDTO> getAllJobPostOfABusiness(@RequestParam String businessEmail) {
        int ojt_enrollment_id = ojt_enrollmentService.getOjt_EnrollmentIdByBusinessEmail(businessEmail);

        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentById(ojt_enrollment_id);

        Business_JobPostDTO business_jobPostDTO = new Business_JobPostDTO();

        List<Job_Post> job_postList = job_postService.getAllJobPostOfBusiness(ojt_enrollment);

        business_jobPostDTO.setJob_postList(job_postList);
        business_jobPostDTO.setBusiness(ojt_enrollment.getBusiness());
        if (job_postList != null) {
            return new ResponseEntity<Business_JobPostDTO>(business_jobPostDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

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

    @GetMapping("/studentsSuggest")
    @ResponseBody
    public ResponseEntity<List<Student>> getListSuggestStudent(){
        String email=getEmailFromToken();
        List<Student> studentList=businessService.getSuggestListStudent(email);
        if(studentList!=null){
            return new ResponseEntity<List<Student>>(studentList,HttpStatus.OK);
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
