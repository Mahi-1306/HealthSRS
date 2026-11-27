package com.healthsrs.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CoachDtos {

    public record CoachRequest(
            @NotBlank(message = "Name is required") String name,
            @NotBlank(message = "Specialization is required") String specialization,
            @NotBlank(message = "Certification is required") String certification,
            @NotNull(message = "Experience is required")
            @Min(value = 0, message = "Experience must be 0 or greater")
            Integer experience,
            String phoneNumber
    ) {}
}
