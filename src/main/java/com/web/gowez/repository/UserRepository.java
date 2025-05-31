package com.web.gowez.repository;

<<<<<<< HEAD
import com.web.gowez.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
=======
import org.springframework.data.jpa.repository.JpaRepository;

import com.web.gowez.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    User findByEmail(String email);
}
>>>>>>> cca4de1 (crud)
