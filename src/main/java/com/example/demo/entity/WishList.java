package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "wishList")
public class WishList {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "option_1")
    private String option_1;


    @Column(name = "option_2")
    private String option_2;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToMany(cascade = {CascadeType.ALL})
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(
            name = "BusinessWishList",
            joinColumns = {
                    @JoinColumn(name = "wishlistId")},
            inverseJoinColumns = {
                    @JoinColumn(name = "businessId")}
    )
    @JsonIgnore
    Set<Business> businesses = new HashSet<>();
}
