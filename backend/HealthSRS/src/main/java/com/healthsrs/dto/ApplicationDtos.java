package com.healthsrs.dto;

import com.healthsrs.entity.ApplicationStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ApplicationDtos {

    public record ApplicantRef(Long id) {}

    public record ApplicationRequest(
            Long applicantId,
            ApplicantRef applicant,
            @NotNull(message = "Experience years is required")
            @Min(value = 0, message = "Experience years must be 0 or greater")
            Integer experienceYears,
            @NotBlank(message = "Specialization is required") String specialization,
            @NotBlank(message = "Certification is required") String certification,
            String phoneNumber,
            String bio
    ) {}

    public record UpdateStatusRequest(
            @NotNull(message = "Status is required") ApplicationStatus status,
            String reviewerNotes
    ) {}
}
