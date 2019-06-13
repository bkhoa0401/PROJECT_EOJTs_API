package com.example.demo.repository;

import com.example.demo.entity.Specialized;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecializedRepository extends JpaRepository<Specialized, Integer> {

    @Query(value = "SELECT s.id \n"
            + "       FROM Specialized s\n"
            + "       WHERE s.name =?1")
    int findSpecializedIdByName(String name);
}
