package com.example.demo.repository;

import com.example.demo.entity.Skill;
import com.example.demo.entity.Specialized;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill,Integer> {

    List<Skill> findBySpecializedId(int specializedId);

    Skill findSkillById(int id);
}
