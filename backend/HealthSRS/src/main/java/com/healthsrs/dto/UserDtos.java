package com.healthsrs.dto;

import com.healthsrs.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserDtos {

    public record CreateUserRequest(
            @NotBlank(message = "Name is required") String name,
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
            @NotBlank(message = "Password is required") String password,
            @NotNull(message = "Role is required") Role role
    ) {}

    public record UpdateUserRequest(
            @NotBlank(message = "Name is required") String name,
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
            Role role,
            String password
    ) {}
}
