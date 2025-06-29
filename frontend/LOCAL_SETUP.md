# Health Management System - Local Setup Guide

## 🚀 Complete Setup Instructions

### Prerequisites
- **XAMPP** (recommended) or **WAMP/MAMP** - includes Apache, MySQL, and PHP
- **Node.js** (v16 or higher) for the frontend
- **Git** (optional, for version control)

### 📁 Project Structure
```
health-management-system/
├── frontend/          # React frontend (this current project)
├── backend/           # PHP API backend
└── database/          # MySQL database files
```

## 🔧 Step 1: Backend Setup (PHP + MySQL)

### 1.1 Install XAMPP
1. Download XAMPP from: https://www.apachefriends.org/
2. Install and start **Apache** and **MySQL** services
3. Access phpMyAdmin at: http://localhost/phpmyadmin

### 1.2 Database Setup
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named: `health_management_system`
3. Import the database schema:
   - Go to the database → Import tab
   - Upload: `supabase/migrations/20250617112518_fancy_sunset.sql`
   - Click "Go" to execute
4. Import demo data:
   - Import tab again
   - Upload: `supabase/migrations/20250617112529_raspy_bar.sql`
   - Click "Go" to execute

### 1.3 Backend Files
1. Copy the entire `backend/` folder to your XAMPP `htdocs` directory
   - Windows: `C:\xampp\htdocs\backend\`
   - Mac: `/Applications/XAMPP/htdocs/backend/`
   - Linux: `/opt/lampp/htdocs/backend/`

2. Verify the backend is working:
   - Visit: http://localhost/backend/api/auth/login
   - You should see a JSON error message (this is expected without POST data)

## 🎨 Step 2: Frontend Setup (React)

### 2.1 Install Dependencies
```bash
# In the project root directory
npm install
```

### 2.2 Update API Configuration
The frontend is already configured to connect to `http://localhost/backend/api`

### 2.3 Start Development Server
```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

## 🧪 Step 3: Test the Application

### 3.1 Demo Account
**Email:** `demo@healthcare.com`  
**Password:** `password123`

### 3.2 Additional Test Accounts
- **Sarah Johnson** - `sarah@healthcare.com` (password123)
  - Pregnant user with diabetes and comprehensive health data
- **Alex Chen** - `alex@healthcare.com` (password123)
  - Fitness enthusiast with workout history

### 3.3 Test Registration
1. Go to the registration page
2. Try the **2-step registration process**:
   - Step 1: Basic info (name, email, password)
   - Step 2: Complete profile OR skip for later

## 🔍 Verification Checklist

### ✅ Backend Verification
- [ ] XAMPP Apache and MySQL are running
- [ ] Database `health_management_system` exists
- [ ] Tables are created (users, meals, workouts, etc.)
- [ ] Demo data is imported
- [ ] Backend API responds at http://localhost/backend/api/

### ✅ Frontend Verification
- [ ] React app starts without errors
- [ ] Login page loads correctly
- [ ] Can log in with demo account
- [ ] Dashboard shows health data and charts
- [ ] All navigation links work
- [ ] Can add new meals, workouts, mood entries
- [ ] Registration process works (both quick and complete)

## 🛠️ Troubleshooting

### Common Issues

**1. Database Connection Error**
- Check XAMPP MySQL is running
- Verify database credentials in `backend/config/database.php`
- Ensure database name is `health_management_system`

**2. CORS Errors**
- Ensure `backend/config/cors.php` is included in all API files
- Check that Apache mod_rewrite is enabled

**3. 404 Errors on API Calls**
- Verify `.htaccess` file exists in backend folder
- Check Apache mod_rewrite is enabled
- Ensure backend folder is in htdocs

**4. Frontend Won't Start**
- Run `npm install` to install dependencies
- Check Node.js version (should be 16+)
- Clear npm cache: `npm cache clean --force`

**5. Login Not Working**
- Check browser console for errors
- Verify backend API is responding
- Test API directly: http://localhost/backend/api/auth/login

### Debug Steps
1. **Check Backend API:**
   ```bash
   curl -X POST http://localhost/backend/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"demo@healthcare.com","password":"password123"}'
   ```

2. **Check Database:**
   - Open phpMyAdmin
   - Browse `users` table
   - Verify demo data exists

3. **Check Frontend Console:**
   - Open browser developer tools
   - Look for network errors or API call failures

## 📊 Features to Test

### 🏠 Dashboard
- Health metrics overview
- Interactive charts (nutrition, mood, fitness)
- Today's summary cards
- Recent activities

### 🍎 Nutrition Tracker
- Add meals with nutritional info
- View daily/weekly nutrition breakdown
- Calorie and macronutrient tracking

### 🧠 Mental Health
- Mood tracking with stress levels
- Journal entries
- Weekly mood trends
- Personalized mindfulness suggestions

### 💪 Fitness Tracker
- Log workouts with duration and calories
- Exercise type distribution
- Weekly activity charts
- Fitness goals progress

### 💊 Medication Manager
- Add medications with reminders
- Track dosage and frequency
- Upcoming medication alerts
- Medication schedule

### 🚨 Emergency Assistance
- Emergency contacts management
- SOS alert system
- Nearby medical facilities
- Emergency information

### 👶 Pregnancy Care
- Pregnancy week tracking
- Due date countdown
- Checkup scheduling
- Trimester-specific recommendations

### 👤 Profile Management
- Personal information
- Health metrics (BMI calculation)
- Medical history
- Fitness goals

## 🎯 Production Deployment Notes

For production deployment:
1. Update database credentials
2. Change API base URL in frontend
3. Enable HTTPS
4. Set up proper error logging
5. Configure backup systems
6. Implement rate limiting
7. Add authentication tokens/sessions

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure all services are running
4. Check browser console for errors
5. Test API endpoints directly

The system is designed to work out of the box with minimal configuration. All demo data and test accounts are pre-configured for immediate testing.