package com.example.demo.controller;

import com.example.demo.dto.BusinessDTO;
import com.example.demo.dto.Business_JobPostDTO;
import com.example.demo.dto.Job_PostDTO;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
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

    //get all post of business
    @GetMapping("/getAllJobPostOfBusiness")
    public ResponseEntity<List<Business_JobPostDTO>> getAllJobPostBusiness() {
        List<Business> businessList = businessService.getAllBusiness();
        List<Business_JobPostDTO> business_jobPostDTOS = new ArrayList<>();
        for (int i = 0; i < businessList.size(); i++) {
            Business_JobPostDTO business_jobPostDTO = new Business_JobPostDTO();
            business_jobPostDTO.setBusiness(businessList.get(i));
            business_jobPostDTO.setJob_postList(businessList.get(i).getOjt_enrollments().get(0).getJob_posts());

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
        if(updateStatus==true){
            return new ResponseEntity<>(HttpStatus.OK);
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
