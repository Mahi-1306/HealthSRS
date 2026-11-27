package com.healthsrs.config;

import com.healthsrs.entity.*;
import com.healthsrs.repository.ApplicationRepository;
import com.healthsrs.repository.HealthCoachRepository;
import com.healthsrs.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HealthCoachRepository healthCoachRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            HealthCoachRepository healthCoachRepository,
            ApplicationRepository applicationRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.healthCoachRepository = healthCoachRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        User admin = ensureUser("Admin User", "admin@test.com", "admin123", Role.ADMIN);
        ensureUser("Reviewer User", "reviewer@test.com", "reviewer123", Role.REVIEWER);
        User applicant = ensureUser("Applicant User", "applicant@test.com", "applicant123", Role.APPLICANT);
        User john = ensureUser("John Doe", "john@test.com", "password123", Role.APPLICANT);
        User jane = ensureUser("Jane Smith", "jane@test.com", "password123", Role.APPLICANT);

        if (healthCoachRepository.count() == 0) {
            healthCoachRepository.saveAll(List.of(
                    new HealthCoach("Dr. Sarah Johnson", "Nutrition & Weight Management", "Certified Nutrition Specialist", 8, "+1-555-0123"),
                    new HealthCoach("Mike Thompson", "Fitness & Exercise", "ACSM Certified Personal Trainer", 5, "+1-555-0124"),
                    new HealthCoach("Lisa Chen", "Mental Health & Wellness", "Licensed Clinical Social Worker", 12, "+1-555-0125"),
                    new HealthCoach("David Rodriguez", "Chronic Disease Management", "Certified Diabetes Educator", 10, "+1-555-0126")
            ));
        }

        if (applicationRepository.count() == 0) {
            Application app1 = new Application();
            app1.setApplicant(john);
            app1.setStatus(ApplicationStatus.PENDING);
            app1.setExperienceYears(3);
            app1.setSpecialization("Nutrition & Weight Management");
            app1.setCertification("NASM Certified Nutrition Coach");
            app1.setPhoneNumber("+1-555-0201");
            app1.setBio("Registered wellness coach helping clients build sustainable nutrition habits.");
            app1.setSubmissionDate(LocalDateTime.now().minusDays(3));

            Application app2 = new Application();
            app2.setApplicant(jane);
            app2.setStatus(ApplicationStatus.UNDER_REVIEW);
            app2.setExperienceYears(5);
            app2.setSpecialization("Fitness & Exercise");
            app2.setCertification("ACE Certified Health Coach");
            app2.setPhoneNumber("+1-555-0202");
            app2.setBio("Specializes in functional mobility and cardiovascular conditioning.");
            app2.setReviewerNotes("Verifying ACE credential expiration date.");
            app2.setSubmissionDate(LocalDateTime.now().minusDays(2));

            Application app3 = new Application();
            app3.setApplicant(applicant);
            app3.setStatus(ApplicationStatus.APPROVED);
            app3.setExperienceYears(6);
            app3.setSpecialization("Mental Health & Wellness");
            app3.setCertification("NBHWC Board Certified Health & Wellness Coach");
            app3.setPhoneNumber("+1-555-0203");
            app3.setBio("Mindfulness and stress-reduction practitioner with corporate wellness experience.");
            app3.setReviewerNotes("Credentials verified and approved.");
            app3.setSubmissionDate(LocalDateTime.now().minusDays(5));
            app3.setReviewedAt(LocalDateTime.now().minusDays(1));

            applicationRepository.saveAll(List.of(app1, app2, app3));
        }
    }

    private User ensureUser(String name, String email, String rawPassword, Role role) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(new User(name, email, passwordEncoder.encode(rawPassword), role)));
    }
}
