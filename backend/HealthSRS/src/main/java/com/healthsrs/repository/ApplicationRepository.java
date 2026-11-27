package com.healthsrs.repository;

import com.healthsrs.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByApplicantIdOrderBySubmissionDateDesc(Long applicantId);
    List<Application> findAllByOrderBySubmissionDateDesc();
}
