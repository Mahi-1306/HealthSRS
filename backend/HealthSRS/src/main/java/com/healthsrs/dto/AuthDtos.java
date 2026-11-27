package com.healthsrs.dto;

import com.healthsrs.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record LoginRequest(
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
            @NotBlank(message = "Password is required") String password
    ) {}

    public record RegisterRequest(
            @NotBlank(message = "Name is required") String name,
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
            @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters") String password
    ) {}

    public record UserInfo(
            Long id,
            String name,
            String email,
            Role role
    ) {}

    public record AuthResponse(
            String token,
            UserInfo user
    ) {}
}
