package com.example.demo.entity;

import com.fasterxml.jackson.annotation.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

//@JsonInclude(JsonInclude.Include.NON_NULL)
//@JsonIgnoreProperties(ignoreUnknown = true, value = {"authorities", "hibernateLazyInitializer", "handler"})
@JsonIgnoreProperties(value = {"authorities"})

@Entity
@Table(name = "Users")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property  = "email")

public class Users {

    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password")
    private String password;


    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(
            name = "userRole",
            joinColumns = {
                    @JoinColumn(name = "userEmail")},
            inverseJoinColumns = {
                    @JoinColumn(name = "roleId")}
    )
//    @JsonManagedReference
    private List<Role> roles;

    public Users() {
    }

    public Users(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }


    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getDescription()));
        }
        System.out.println("authorities" + authorities);
        return authorities;
    }
}
