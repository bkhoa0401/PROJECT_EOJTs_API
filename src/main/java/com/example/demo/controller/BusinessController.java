package com.example.demo.controller;

import com.example.demo.dto.BusinessDTO;
import com.example.demo.entity.Business;
import com.example.demo.entity.Job_Post;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Skill;
import com.example.demo.service.BusinessImportFileService;
import com.example.demo.service.BusinessService;
import com.example.demo.service.Ojt_EnrollmentService;
import com.example.demo.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
