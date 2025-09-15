-- Insert sample users first
INSERT INTO users (name, email, password_hash, role) VALUES 
('John Doe', 'john@test.com', '$2a$10$dummy', 'APPLICANT'),
('Jane Smith', 'jane@test.com', '$2a$10$dummy', 'APPLICANT');

-- Insert sample applications
INSERT INTO applications (applicant_id, status, experience_years, submission_date) VALUES 
(1, 'PENDING', 3, NOW()),
(2, 'PENDING', 5, NOW()),
(1, 'APPROVED', 2, NOW());