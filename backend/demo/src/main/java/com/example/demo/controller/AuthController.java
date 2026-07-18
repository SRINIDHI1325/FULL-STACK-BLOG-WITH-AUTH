package com.example.demo.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Collections;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.payload.AuthRequest;
import com.example.demo.payload.AuthResponse;
import com.example.demo.payload.RegisterRequest;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtils;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtils jwtUtils;

  public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtils = jwtUtils;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
    if (userRepository.existsByUsername(req.username)) {
      return ResponseEntity.badRequest().body("Username already taken");
    }
    Role role = (req.role != null && req.role.equalsIgnoreCase("ADMIN")) ? Role.ADMIN : Role.USER;
    User user = new User(req.username, passwordEncoder.encode(req.password), role);
    userRepository.save(user);
    return ResponseEntity.ok("Registered");
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
    var opt = userRepository.findByUsername(req.username);
    if (opt.isPresent() && passwordEncoder.matches(req.password, opt.get().getPassword())) {
      String token = jwtUtils.generateToken(opt.get().getUsername());
      return ResponseEntity.ok(new AuthResponse(token));
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Collections.singletonMap("error", "Invalid credentials"));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication authentication) {
    if (authentication == null || authentication.getName() == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of("error", "Authentication required"));
    }

    return userRepository.findByUsername(authentication.getName())
        .map(user -> ResponseEntity.ok(Map.of(
            "username", user.getUsername(),
            "role", user.getRole().name())))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "User not found")));
  }
}
