package com.web.gowez.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.web.gowez.model.Role;
import com.web.gowez.model.User;
import com.web.gowez.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public String registerUser(User user) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                return "Email already registered!";
            }
            
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRole(Role.USER);
            user.setUserId(null);
            User savedUser = userRepository.save(user);
            
            return "User registered successfully with ID: " + savedUser.getUserId();
        } catch (Exception e) {
            return "Registration failed: " + e.getMessage();
        }
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }
}