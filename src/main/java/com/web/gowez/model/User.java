package com.web.gowez.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")

public class User{
    @Id 
    @GeneratedValue
    private String user_id;

    private String nama_lengkap;
    private String email;
    private String password;
    private int no_hp;
    private String alamat;

    @Enumerated(EnumType.STRING)
    private Role role;
}

enum Role {
    ADMIN,
    USER
}