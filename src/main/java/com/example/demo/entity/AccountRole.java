package com.example.demo.entity;

import javax.persistence.*;

@Entity
@Table(name = "AccountRole")
public class AccountRole {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id",columnDefinition = "0")
    private int id;

    @Column(name = "accountId")
    private int accountId;

    @Column(name = "roleId")
    private int roleId;

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }
}
