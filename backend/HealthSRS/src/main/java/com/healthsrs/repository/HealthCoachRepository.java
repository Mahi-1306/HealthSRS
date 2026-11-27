package com.healthsrs.repository;

import com.healthsrs.entity.HealthCoach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthCoachRepository extends JpaRepository<HealthCoach, Long> {
    List<HealthCoach> findAllByOrderByIdAsc();
    boolean existsByNameAndSpecialization(String name, String specialization);
}
