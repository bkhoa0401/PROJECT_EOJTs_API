package com.example.demo.service;

import com.example.demo.entity.Business_Proposed;

import java.util.List;

public interface IBusiness_ProposedService {
    List<Business_Proposed> getAll();
    Business_Proposed findById(int id);
    void updateStatusByStartUpRoom(int id,String comment,boolean status);
    void updateStatusByHeadOfTraining(int id,String comment,boolean status);
    void updateStatusByHeadMaster(int id,boolean status);
}
