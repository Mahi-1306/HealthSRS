# Role-Based Access Control Test Scenarios

## Test Users Setup
Create these test users in your database:

```sql
-- ADMIN user
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@test.com', '$2a$10$...', 'ADMIN');

-- REVIEWER user  
INSERT INTO users (name, email, password_hash, role) VALUES 
('Reviewer User', 'reviewer@test.com', '$2a$10$...', 'REVIEWER');

-- APPLICANT user
INSERT INTO users (name, email, password_hash, role) VALUES 
('Applicant User', 'applicant@test.com', '$2a$10$...', 'APPLICANT');
```

## API Endpoint Tests

### 1. User Management Endpoints (ADMIN only)
```bash
# Should work for ADMIN
GET /api/users
POST /api/users  
GET /api/users/{id}
PUT /api/users/{id}

# Should return 403 for REVIEWER/APPLICANT
```

### 2. Application Management
```bash
# ADMIN - Full access
GET /api/applications (all applications)

# REVIEWER - Review access
GET /api/applications/review
PUT /api/applications/{id}/status

# APPLICANT - Own applications only
POST /api/applications (create own)
GET /api/applications/my (own applications)
GET /api/applications/{id} (only own)
PUT /api/applications/{id} (only own)
```

### 3. Cross-User Access Tests
```bash
# APPLICANT trying to access another user's application
GET /api/applications/{other_user_app_id} → Should return 403

# APPLICANT trying to create application for another user
POST /api/applications with different applicant.id → Should return 403
```