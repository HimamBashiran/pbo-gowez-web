package com.web.gowez.model;

<<<<<<< HEAD
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
=======
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
>>>>>>> cca4de1 (crud)
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

<<<<<<< HEAD

=======
>>>>>>> cca4de1 (crud)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
<<<<<<< HEAD

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
=======
public class User {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "nama_lengkap", nullable = false)
    private String namaLengkap;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "no_hp")
    private String noHp;
    
    @Column(name = "alamat")
    private String alamat;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;
>>>>>>> cca4de1 (crud)
}