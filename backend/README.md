# Health Management System - PHP Backend

This is the PHP backend API for the Smart Health and Wellness Management System.

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `health_management_system`
2. Import the database schema:
   ```bash
   mysql -u root -p health_management_system < database/schema.sql
   ```
3. Import demo data:
   ```bash
   mysql -u root -p health_management_system < database/demo_data.sql
   ```

### 2. Configuration
1. Update database credentials in `config/database.php`:
   - `$host` - Database host (default: localhost)
   - `$db_name` - Database name (default: health_management_system)
   - `$username` - Database username (default: root)
   - `$password` - Database password (default: empty)

### 3. Web Server Setup
1. Place the backend folder in your web server directory (e.g., `htdocs` for XAMPP)
2. Ensure mod_rewrite is enabled for clean URLs
3. The API will be accessible at: `http://localhost/backend/api/`

## Demo Account

**Email:** `demo@healthcare.com`  
**Password:** `password123`

Additional test accounts:
- `sarah@healthcare.com` (password123) - Pregnant user with diabetes
- `alex@healthcare.com` (password123) - Fitness enthusiast

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Profile
- `PUT /api/user/profile` - Update user profile

### Meals
- `GET /api/meals?user_id={id}` - Get user meals
- `GET /api/meals?user_id={id}&today=1` - Get today's meals
- `POST /api/meals` - Add new meal

### Mood Entries
- `GET /api/moods?user_id={id}` - Get user mood entries
- `GET /api/moods?user_id={id}&today=1` - Get today's mood
- `POST /api/moods` - Add new mood entry

### Workouts
- `GET /api/workouts?user_id={id}` - Get user workouts
- `POST /api/workouts` - Add new workout

### Medications
- `GET /api/medications?user_id={id}` - Get user medications
- `POST /api/medications` - Add new medication
- `DELETE /api/medications?id={id}` - Delete medication

### Emergency Contacts
- `GET /api/emergency?user_id={id}` - Get user emergency contacts
- `POST /api/emergency` - Add new emergency contact
- `DELETE /api/emergency?id={id}` - Delete emergency contact

### Pregnancy Data
- `GET /api/pregnancy?user_id={id}` - Get user pregnancy data
- `POST /api/pregnancy` - Add pregnancy data
- `PUT /api/pregnancy` - Update pregnancy data

## Database Schema

The system includes the following tables:
- `users` - User profiles and authentication
- `meals` - Nutrition tracking
- `mood_entries` - Mental health tracking
- `workouts` - Fitness tracking
- `medications` - Medication management
- `emergency_contacts` - Emergency contact information
- `pregnancy_data` - Pregnancy tracking data

## Security Features

- Password hashing using bcrypt
- SQL injection prevention with prepared statements
- Input sanitization and validation
- CORS headers for cross-origin requests
- JSON response format for all endpoints

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx with mod_rewrite enabled
- PDO MySQL extension

## Development Notes

- All API responses are in JSON format
- Timestamps are stored in MySQL TIMESTAMP format
- JSON fields are used for arrays (medical_history, fitness_goals, reminder_times)
- Foreign key constraints ensure data integrity
- Indexes are created for optimal query performance