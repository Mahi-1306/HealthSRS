package com.healthsrs.controller;

import com.healthsrs.dto.UserDtos.*;
import com.healthsrs.entity.User;
import com.healthsrs.exception.BadRequestException;
import com.healthsrs.exception.ResourceNotFoundException;
import com.healthsrs.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Users", description = "Admin user management endpoints")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @Operation(summary = "List all users (ADMIN only)")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    @Operation(summary = "Create a new user (ADMIN only)")
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email is already in use");
        }
        User user = new User(
                request.name().trim(),
                normalizedEmail,
                passwordEncoder.encode(request.password()),
                request.role()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID (ADMIN only)")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user by ID (ADMIN only)")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String normalizedEmail = request.email().trim().toLowerCase();
        if (!existing.getEmail().equalsIgnoreCase(normalizedEmail) && userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email is already in use");
        }

        existing.setName(request.name().trim());
        existing.setEmail(normalizedEmail);
        if (request.role() != null) {
            existing.setRole(request.role());
        }
        if (request.password() != null && !request.password().isBlank()) {
            existing.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        return userRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user by ID (ADMIN only)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
