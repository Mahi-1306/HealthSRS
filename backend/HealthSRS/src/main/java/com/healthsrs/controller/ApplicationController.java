package com.healthsrs.controller;

import com.healthsrs.dto.ApplicationDtos.*;
import com.healthsrs.entity.*;
import com.healthsrs.exception.BadRequestException;
import com.healthsrs.exception.ResourceNotFoundException;
import com.healthsrs.repository.ApplicationRepository;
import com.healthsrs.repository.HealthCoachRepository;
import com.healthsrs.repository.UserRepository;
import com.healthsrs.security.CurrentUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Health Coach application submission and review workflows")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final HealthCoachRepository healthCoachRepository;
    private final CurrentUserService currentUserService;

    public ApplicationController(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            HealthCoachRepository healthCoachRepository,
            CurrentUserService currentUserService
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.healthCoachRepository = healthCoachRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all applications (ADMIN only)")
    public List<Application> getAllApplications() {
        return applicationRepository.findAllByOrderBySubmissionDateDesc();
    }

    @GetMapping("/review")
    @PreAuthorize("hasAnyRole('REVIEWER', 'ADMIN')")
    @Operation(summary = "Get applications for review (REVIEWER / ADMIN)")
    public List<Application> getApplicationsForReview() {
        return applicationRepository.findAllByOrderBySubmissionDateDesc();
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('APPLICANT', 'ADMIN')")
    @Operation(summary = "Get current user's applications")
    public List<Application> getMyApplications() {
        User current = currentUserService.getCurrentUser();
        return applicationRepository.findByApplicantIdOrderBySubmissionDateDesc(current.getId());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application by ID (ADMIN, REVIEWER, or owning APPLICANT)")
    public Application getApplicationById(@PathVariable Long id) {
        Application app = findApplication(id);
        User current = currentUserService.getCurrentUser();
        if (current.getRole() == Role.APPLICANT && !app.getApplicant().getId().equals(current.getId())) {
            throw new AccessDeniedException("You can only view your own applications");
        }
        return app;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('APPLICANT', 'ADMIN')")
    @Operation(summary = "Submit a new Health Coach application")
    public ResponseEntity<Application> createApplication(@Valid @RequestBody ApplicationRequest request) {
        User current = currentUserService.getCurrentUser();
        Long requestedApplicantId = request.applicant() != null && request.applicant().id() != null
                ? request.applicant().id()
                : request.applicantId();

        User targetApplicant = current;
        if (requestedApplicantId != null && !requestedApplicantId.equals(current.getId())) {
            if (current.getRole() != Role.ADMIN) {
                throw new AccessDeniedException("Applicants cannot submit applications for another user");
            }
            targetApplicant = userRepository.findById(requestedApplicantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Applicant user not found: " + requestedApplicantId));
        }

        Application app = new Application();
        app.setApplicant(targetApplicant);
        app.setStatus(ApplicationStatus.PENDING);
        app.setExperienceYears(request.experienceYears());
        app.setSpecialization(request.specialization().trim());
        app.setCertification(request.certification().trim());
        app.setPhoneNumber(request.phoneNumber() != null ? request.phoneNumber().trim() : null);
        app.setBio(request.bio() != null ? request.bio().trim() : null);
        app.setSubmissionDate(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.CREATED).body(applicationRepository.save(app));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('APPLICANT', 'ADMIN')")
    @Operation(summary = "Update an existing application (owning APPLICANT or ADMIN)")
    public Application updateApplication(@PathVariable Long id, @Valid @RequestBody ApplicationRequest request) {
        Application app = findApplication(id);
        User current = currentUserService.getCurrentUser();

        if (current.getRole() == Role.APPLICANT && !app.getApplicant().getId().equals(current.getId())) {
            throw new AccessDeniedException("You can only update your own applications");
        }
        if (app.getStatus() == ApplicationStatus.APPROVED && current.getRole() != Role.ADMIN) {
            throw new BadRequestException("Approved applications cannot be edited");
        }

        app.setExperienceYears(request.experienceYears());
        app.setSpecialization(request.specialization().trim());
        app.setCertification(request.certification().trim());
        app.setPhoneNumber(request.phoneNumber() != null ? request.phoneNumber().trim() : null);
        app.setBio(request.bio() != null ? request.bio().trim() : null);
        if (app.getStatus() == ApplicationStatus.REJECTED) {
            app.setStatus(ApplicationStatus.PENDING);
        }

        return applicationRepository.save(app);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('REVIEWER', 'ADMIN')")
    @Operation(summary = "Update application review status (REVIEWER / ADMIN)")
    public Application updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        Application app = findApplication(id);
        app.setStatus(request.status());
        app.setReviewerNotes(request.reviewerNotes() != null ? request.reviewerNotes().trim() : null);
        app.setReviewedAt(LocalDateTime.now());
        Application saved = applicationRepository.save(app);

        if (request.status() == ApplicationStatus.APPROVED) {
            String coachName = app.getApplicant().getName();
            if (!healthCoachRepository.existsByNameAndSpecialization(coachName, app.getSpecialization())) {
                healthCoachRepository.save(new HealthCoach(
                        coachName,
                        app.getSpecialization(),
                        app.getCertification(),
                        app.getExperienceYears(),
                        app.getPhoneNumber() != null ? app.getPhoneNumber() : "Not provided"
                ));
            }
        }
        return saved;
    }

    private Application findApplication(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }
}
