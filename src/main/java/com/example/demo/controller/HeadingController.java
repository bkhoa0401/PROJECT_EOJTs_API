package com.example.demo.controller;

import com.example.demo.entity.Business_Proposed;
import com.example.demo.entity.Role;
import com.example.demo.entity.Users;
import com.example.demo.repository.IBusiness_ProposedRepository;
import com.example.demo.service.IBusiness_ProposedService;
import com.example.demo.service.IUsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/heading")
public class HeadingController {

    @Autowired
    IBusiness_ProposedService iBusiness_proposedService;

    @Autowired
    IUsersService iUsersService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<Business_Proposed>> getListBusiness_Proposed() {
        List<Business_Proposed> business_proposeds = iBusiness_proposedService.getAll();
        if (business_proposeds != null) {
            return new ResponseEntity<List<Business_Proposed>>(business_proposeds, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/startup")
    public ResponseEntity<Void> updateStatusAcceptByStartUpRoom(@RequestParam int id,
                                                                @RequestParam String comment, @RequestParam boolean status) throws Exception {
        String email = getEmailFromToken();
        Users users = iUsersService.findUserByEmail(email);
        List<Role> roles = users.getRoles();

        for (int i = 0; i < roles.size(); i++) {
            if (roles.get(i).getDescription().equals("ROLE_STARTUP")) {
                iBusiness_proposedService.updateStatusByStartUpRoom(id, comment, status, email);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/headTraining")
    public ResponseEntity<Void> updateStatusAcceptByHeadTraining(@RequestParam int id,
                                                                 @RequestParam String comment, @RequestParam boolean status) throws Exception {
        String email = getEmailFromToken();
        Users users = iUsersService.findUserByEmail(email);
        List<Role> roles = users.getRoles();

        for (int i = 0; i < roles.size(); i++) {
            if (roles.get(i).getDescription().equals("ROLE_HEADTRAINING")) {
                iBusiness_proposedService.updateStatusByHeadOfTraining(id, comment, status, email);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);

    }

    @PutMapping("/headMaster")
    public ResponseEntity<Void> updateStatusAcceptByHeadMaster(@RequestParam int id, @RequestParam boolean status) throws Exception {
        String email = getEmailFromToken();
        Users users = iUsersService.findUserByEmail(email);
        List<Role> roles = users.getRoles();

        for (int i = 0; i < roles.size(); i++) {
            if (roles.get(i).getDescription().equals("ROLE_HEADMASTER")) {
                iBusiness_proposedService.updateStatusByHeadMaster(id, status, email);
                return new ResponseEntity<>(HttpStatus.OK);
            }
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
