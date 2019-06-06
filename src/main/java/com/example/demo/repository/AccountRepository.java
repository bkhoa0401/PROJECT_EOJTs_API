package com.example.demo.repository;

import com.example.demo.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    public Account findAccountByEmailAndPassword(String email, String password);

    @Query(value = "SELECT a \n"
            + "       FROM Account a\n"
            + "       WHERE a.email=?1 and a.password=?2\n")
    public Account findAccountStudentCustom(String email, String password);

    public Account findAccountByEmail(String email);

}
