package com.example.demo.entity;

import javax.persistence.*;

@Entity
@Table(name = "BusinessWishList")
public class BusinessWishList {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "businessId")
    private int businessId;

    @Column(name = "wishlistId")
    private int wishlistId;

    public int getBusinessId() {
        return businessId;
    }

    public void setBusinessId(int businessId) {
        this.businessId = businessId;
    }

    public int getWishlistId() {
        return wishlistId;
    }

    public void setWishlistId(int wishlistId) {
        this.wishlistId = wishlistId;
    }
}
