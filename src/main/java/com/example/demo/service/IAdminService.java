package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;

import java.util.ArrayList;
import java.util.List;

public interface IAdminService {

    Admin findAdminByEmail(String email);

    List<Business_ListJobPostDTO> getJobPostsOfBusinesses();

    List<Business> getSuggestedBusinessListForFail(Student student);

    List<Business> filterListBusinessByStudentSpecialized(int specializedId, List<Business> businessList);

    Businesses_OptionsDTO getBusinesses_OptionDTO();

    Businesses_StudentsDTO getBusinesses_StudentsDTO();

    List<Statistical_EvaluationDTO> getListStatistical_EvaluationDTO();

    List<StatisticalQuestionAnswerDTO> getListStatisticalQuestionAnswerDTO();
}
