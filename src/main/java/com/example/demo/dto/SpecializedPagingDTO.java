package com.example.demo.dto;

import com.example.demo.entity.Specialized;

import java.io.Serializable;
import java.util.List;

public class SpecializedPagingDTO implements Serializable {
    int pageNumber;
    List<Specialized> specializedList;

    public SpecializedPagingDTO() {
    }

    public SpecializedPagingDTO(int pageNumber, List<Specialized> specializedList) {
        this.pageNumber = pageNumber;
        this.specializedList = specializedList;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public List<Specialized> getSpecializedList() {
        return specializedList;
    }

    public void setSpecializedList(List<Specialized> specializedList) {
        this.specializedList = specializedList;
    }
}
