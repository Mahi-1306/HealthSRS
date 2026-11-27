-- Insert sample health coaches
INSERT INTO health_coach (name, specialization, certification, experience, phone_number) VALUES 
('Dr. Sarah Johnson', 'Nutrition & Weight Management', 'Certified Nutrition Specialist', 8, '+1-555-0123'),
('Mike Thompson', 'Fitness & Exercise', 'ACSM Certified Personal Trainer', 5, '+1-555-0124'),
('Lisa Chen', 'Mental Health & Wellness', 'Licensed Clinical Social Worker', 12, '+1-555-0125'),
('David Rodriguez', 'Chronic Disease Management', 'Certified Diabetes Educator', 10, '+1-555-0126');

-- Insert sample applications (if needed)
INSERT INTO application (applicant_id, status, experience_years, created_date) VALUES 
(1, 'PENDING', 3, NOW()),
(2, 'PENDING', 5, NOW());