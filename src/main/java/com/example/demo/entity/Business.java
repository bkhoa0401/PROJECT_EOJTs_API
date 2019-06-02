package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "business")
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "description")
    private String description;

    @Column(name = "logo")
    private String logo;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    private Set<HiringRequest> hiringRequests;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    private Set<Invitation> invitations;

    @ManyToMany(mappedBy = "businesses")
    @JsonIgnore
    private Set<WishList> wishLists =new HashSet<>();
}

