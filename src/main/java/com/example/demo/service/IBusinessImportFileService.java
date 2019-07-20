package com.example.demo.service;

import com.example.demo.dto.BusinessDTO;

public interface IBusinessImportFileService {

    void insertBusiness(BusinessDTO businessDTO) throws Exception;
}
