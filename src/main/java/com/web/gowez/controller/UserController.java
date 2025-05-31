package com.web.gowez.controller;

<<<<<<< HEAD
import org.springframework.web.bind.annotation.*;

@RestController
// @RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    
=======
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.web.gowez.model.User;
import com.web.gowez.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
>>>>>>> cca4de1 (crud)
    @GetMapping("/getUser")
    public String getUser() {
        return "Hello User";
    }

<<<<<<< HEAD
=======
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
            }
            
            User user = userService.findByEmail(email);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password"));
            }
            
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password"));
            }
            
            return ResponseEntity.ok(Map.of(
                "userId", user.getUserId(),
                "name", user.getNamaLengkap(),
                "email", user.getEmail(),
                "role", user.getRole()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }
>>>>>>> cca4de1 (crud)
    
    @PostMapping("/pong")
    public String pong() {
        return "Pong";
    }
}