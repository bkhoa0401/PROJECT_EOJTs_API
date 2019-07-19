package com.example.demo.service;

import com.example.demo.dto.Business_ListJobPostDTO;
import com.example.demo.entity.*;

import java.util.ArrayList;
import java.util.List;

public interface IAdminService {

    Admin findAdminByEmail(String email);

    List<Business_ListJobPostDTO> getJobPostsOfBusinesses();
}
