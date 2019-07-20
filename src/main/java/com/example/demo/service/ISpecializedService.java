package com.example.demo.service;

import com.example.demo.entity.Specialized;

import java.util.List;

public interface ISpecializedService {

    int fullTextSearch(String specializedName);

    List<Specialized> getAllSpecialized();


    int getIdByName(String name);

    boolean createSpecialized(Specialized specialized);

    List<Specialized> updateSpecialized(Specialized specialized);

    boolean updateStatusSpecialized(int specializedId, boolean status);

    Specialized getSpecializedById(int id);
}
