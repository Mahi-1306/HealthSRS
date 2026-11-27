package com.healthsrs.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "health_coach")
public class HealthCoach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 150)
    private String specialization;

    @Column(nullable = false, length = 200)
    private String certification;

    @Column(nullable = false)
    private Integer experience;

    @Column(name = "phone_number", length = 40)
    private String phoneNumber;

    public HealthCoach() {
    }

    public HealthCoach(String name, String specialization, String certification, Integer experience, String phoneNumber) {
        this.name = name;
        this.specialization = specialization;
        this.certification = certification;
        this.experience = experience;
        this.phoneNumber = phoneNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getCertification() {
        return certification;
    }

    public void setCertification(String certification) {
        this.certification = certification;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
