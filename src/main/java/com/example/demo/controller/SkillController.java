package com.example.demo.controller;


import com.example.demo.dto.SkillDTO;
import com.example.demo.dto.SpecializedDTO;
import com.example.demo.entity.Skill;
import com.example.demo.entity.Specialized;
import com.example.demo.service.ISkillService;
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
    ISkillService skillService;


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
    public ResponseEntity<Skill> getSkillById(@RequestParam int id) {
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


    @GetMapping("/bySpecializedId")
    @ResponseBody
    public ResponseEntity<List<Skill>> getListSkillBySpecializedId(@RequestParam int specializedId) {

        List<Skill> skills = skillService.getListSkillBySpecialized(specializedId);

        if (skills != null) {
            return new ResponseEntity<List<Skill>>(skills, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/byListSpecializedId")
    @ResponseBody
    public ResponseEntity<List<Skill>> getListSkillByListSpecializedId(@RequestBody List<SpecializedDTO> listSpecializedId) {
        List<Skill> skillList = new ArrayList<>();
        for (int i = 0; i < listSpecializedId.size(); i++) {
            List<Skill> skillsBySpecializedId = skillService.getListSkillBySpecialized(listSpecializedId.get(i).getId());
            skillList.addAll(skillsBySpecializedId);
        }
        if (skillList != null) {
            return new ResponseEntity<List<Skill>>(skillList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PostMapping("/isExisted")
    @ResponseBody
    public ResponseEntity<List<SkillDTO>> getListSkillExistedByListName(@RequestBody List<String> skillDTOList) {
        List<SkillDTO> skillDTOSNotFound = new ArrayList<>();
        for (int i = 0; i < skillDTOList.size(); i++) {

            Skill skillFound = skillService.getSkillByName(skillDTOList.get(i));

            if (skillFound == null) {
                SkillDTO skillDTO = new SkillDTO();
                skillDTO.setName(skillDTOList.get(i));
                skillDTOSNotFound.add(skillDTO);
            }
        }
        if (skillDTOSNotFound.size() != 0) {
            return new ResponseEntity<List<SkillDTO>>(skillDTOSNotFound, HttpStatus.OK);
        }
        return new ResponseEntity<List<SkillDTO>>(skillDTOSNotFound, HttpStatus.NO_CONTENT);
    }

    @PostMapping("/listSkill")
    @ResponseBody
    public ResponseEntity<Void> createListSkill(@RequestBody List<Skill> skills) {

        for (int i = 0; i < skills.size(); i++) {

            List<Skill> skillList = skillService.getAllSkill();
            int sizeList = skillList.size();

            Skill skill = skills.get(i);
            skill.setId(sizeList + 1);
            skill.setStatus(true);
            skillService.createSkill(skill);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
