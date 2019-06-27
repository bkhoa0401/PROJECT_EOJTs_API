package com.example.demo.controller;


import com.example.demo.entity.Skill;
import com.example.demo.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/skill")
public class SkillController {

    @Autowired
    SkillService skillService;


    @GetMapping
    @ResponseBody
    public ResponseEntity<List<Skill>> getAllSkill() {
        HttpStatus httpStatus;
        List<Skill> skillList = new ArrayList<>();

        skillList = skillService.getAllSkill();

        if (skillList != null) {
            httpStatus = HttpStatus.OK;
            return new ResponseEntity<List<Skill>>(skillList, httpStatus);
        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<List<Skill>>(skillList, httpStatus);
        }
    }

    @GetMapping("/id")
    @ResponseBody
    public ResponseEntity<Skill> getSkilldById(@RequestParam int id) {
        HttpStatus httpStatus;
        Skill skill = skillService.getSkillById(id);

        if (skill != null) {
            httpStatus = HttpStatus.OK;
            return new ResponseEntity<Skill>(skill, httpStatus);
        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<Skill>(skill, httpStatus);
        }
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<Boolean> createSkill(@RequestBody Skill skill) {
        boolean result = false;
        HttpStatus httpStatus;

        int skillId = skillService.fullTextSearch(skill.getName());

        List<Skill> skillList = skillService.getAllSkill();

        int sizeList = skillList.size();

        if (skillId == 0) {
            skill.setId(sizeList + 1);
            if (skillService.createSkill(skill)) {
                result = true;
                httpStatus = HttpStatus.OK;
            } else {
                httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        } else {
            httpStatus = HttpStatus.CONFLICT;
        }
        return new ResponseEntity<Boolean>(result, httpStatus);
    }

    @PutMapping
    @ResponseBody
    public ResponseEntity<Boolean> updateSkill(@RequestBody Skill skill) {
        boolean result = skillService.updateSkill(skill);
        if (result == true) {
            return new ResponseEntity<Boolean>(result, HttpStatus.OK);
        }
        return new ResponseEntity<Boolean>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @PutMapping("/status")
    @ResponseBody
    public ResponseEntity<Boolean> updateStatusSkill(@RequestParam int id, @RequestParam boolean status) {
        boolean result = skillService.updateStatusSkill(id, status);
        if (result == true) {
            return new ResponseEntity<Boolean>(result, HttpStatus.OK);
        }
        return new ResponseEntity<Boolean>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
