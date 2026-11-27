package com.healthsrs.controller;

import com.healthsrs.dto.AuthDtos.*;
import com.healthsrs.entity.Role;
import com.healthsrs.entity.User;
import com.healthsrs.exception.BadRequestException;
import com.healthsrs.repository.UserRepository;
import com.healthsrs.security.CurrentUserService;
import com.healthsrs.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Login, registration, and current user session")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CurrentUserService currentUserService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            CurrentUserService currentUserService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate with email and password")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
        );
        User user = userRepository.findByEmail(normalizedEmail).orElseThrow();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, toUserInfo(user)));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new applicant account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with this email already exists");
        }
        User user = new User(
                request.name().trim(),
                normalizedEmail,
                passwordEncoder.encode(request.password()),
                Role.APPLICANT
        );
        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, toUserInfo(saved)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user profile")
    public ResponseEntity<UserInfo> me() {
        User current = currentUserService.getCurrentUser();
        return ResponseEntity.ok(toUserInfo(current));
    }

    private UserInfo toUserInfo(User user) {
        return new UserInfo(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
