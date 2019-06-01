package com.example.demo.repository;

import com.example.demo.entity.Account;
import com.example.demo.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    public Account findAccountByEmailAndPassword(String email, String password);

    @Query(value = "SELECT a \n"
            + "       FROM Account a, Role r, AccountRole ar \n"
            + "       WHERE ar.accountId = a.id AND ar.roleId=r.id and a.email=?1 and a.password=?2 and r.description=?3 \n")
    public Account findAccountStudentCustom(String email, String password, String role);

    public Account findAccountByEmail(String email);

}
