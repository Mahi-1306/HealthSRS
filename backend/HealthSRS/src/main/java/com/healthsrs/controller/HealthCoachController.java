package com.healthsrs.controller;

import com.healthsrs.dto.CoachDtos.CoachRequest;
import com.healthsrs.entity.HealthCoach;
import com.healthsrs.exception.ResourceNotFoundException;
import com.healthsrs.repository.HealthCoachRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coaches")
@Tag(name = "Health Coaches", description = "Directory of certified health coaches")
public class HealthCoachController {

    private final HealthCoachRepository healthCoachRepository;

    public HealthCoachController(HealthCoachRepository healthCoachRepository) {
        this.healthCoachRepository = healthCoachRepository;
    }

    @GetMapping
    @Operation(summary = "List all certified health coaches")
    public List<HealthCoach> getAllCoaches() {
        return healthCoachRepository.findAllByOrderByIdAsc();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new health coach (ADMIN only)")
    public ResponseEntity<HealthCoach> createCoach(@Valid @RequestBody CoachRequest request) {
        HealthCoach coach = new HealthCoach(
                request.name().trim(),
                request.specialization().trim(),
                request.certification().trim(),
                request.experience(),
                request.phoneNumber() != null ? request.phoneNumber().trim() : null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(healthCoachRepository.save(coach));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update health coach details (ADMIN only)")
    public HealthCoach updateCoach(@PathVariable Long id, @Valid @RequestBody CoachRequest request) {
        HealthCoach coach = healthCoachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health coach not found with id: " + id));
        coach.setName(request.name().trim());
        coach.setSpecialization(request.specialization().trim());
        coach.setCertification(request.certification().trim());
        coach.setExperience(request.experience());
        coach.setPhoneNumber(request.phoneNumber() != null ? request.phoneNumber().trim() : null);
        return healthCoachRepository.save(coach);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a health coach (ADMIN only)")
    public ResponseEntity<Void> deleteCoach(@PathVariable Long id) {
        if (!healthCoachRepository.existsById(id)) {
            throw new ResourceNotFoundException("Health coach not found with id: " + id);
        }
        healthCoachRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
