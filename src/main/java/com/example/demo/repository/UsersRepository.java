package com.example.demo.repository;

import com.example.demo.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users,String> {

    public Users findUserByEmailAndPassword(String email, String password);

    @Query(value = "SELECT a \n"
            + "       FROM Users a\n"
            + "       WHERE a.email=?1 and a.password=?2\n")
    public Users findUserCustom(String email, String password);

    public Users findUserByEmail(String email);
}
