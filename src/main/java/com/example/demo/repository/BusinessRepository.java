package com.example.demo.repository;

import com.example.demo.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessRepository extends JpaRepository<Business, String> {

    Business findBusinessByEmail(String email);

    @Query(value = "select b from Business b where b.business_name=?1")
    Business findBusinessByBusiness_name(String name);
}
