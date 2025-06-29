-- Demo data for Health Management System

USE health_management_system;

-- Insert demo user (password: 'password123')
INSERT INTO users (name, email, password, age, gender, height, weight, medical_history, fitness_goals, pregnancy_status, phone, address, emergency_contact) VALUES
('John Doe', 'demo@healthcare.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 30, 'male', 175.00, 70.00, '["Hypertension", "Allergies to peanuts"]', '["Weight Loss", "Muscle Building", "Cardio Health"]', FALSE, '+1234567890', '123 Health Street, Wellness City, WC 12345', 'Jane Doe - +1234567891'),
('Sarah Johnson', 'sarah@healthcare.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 28, 'female', 165.00, 60.00, '["Diabetes Type 1"]', '["Flexibility", "Stress Relief", "General Fitness"]', TRUE, '+1234567892', '456 Wellness Ave, Health Town, HT 67890', 'Mike Johnson - +1234567893'),
('Alex Chen', 'alex@healthcare.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 35, 'other', 170.00, 65.00, '[]', '["Endurance", "Weight Loss"]', FALSE, '+1234567894', '789 Fitness Blvd, Active City, AC 13579', 'Emma Chen - +1234567895');

-- Insert demo meals
INSERT INTO meals (user_id, food_item, calories, protein, carbs, fats, meal_type, date) VALUES
(1, 'Grilled Chicken Salad', 350, 30.0, 15.0, 18.0, 'lunch', '2024-01-15 12:30:00'),
(1, 'Oatmeal with Berries', 280, 8.0, 45.0, 6.0, 'breakfast', '2024-01-15 08:00:00'),
(1, 'Salmon with Quinoa', 420, 35.0, 25.0, 20.0, 'dinner', '2024-01-14 19:00:00'),
(1, 'Greek Yogurt', 150, 15.0, 12.0, 5.0, 'snack', '2024-01-14 15:30:00'),
(2, 'Avocado Toast', 320, 12.0, 35.0, 18.0, 'breakfast', '2024-01-15 09:00:00'),
(2, 'Quinoa Buddha Bowl', 380, 18.0, 45.0, 15.0, 'lunch', '2024-01-15 13:00:00'),
(3, 'Protein Smoothie', 250, 25.0, 20.0, 8.0, 'breakfast', '2024-01-15 07:30:00'),
(3, 'Turkey Sandwich', 340, 28.0, 30.0, 12.0, 'lunch', '2024-01-15 12:00:00');

-- Insert demo mood entries
INSERT INTO mood_entries (user_id, mood, stress_level, journal_text, date) VALUES
(1, 'good', 3, 'Feeling productive today! Had a great workout and healthy meals.', '2024-01-15 20:00:00'),
(1, 'excellent', 2, 'Amazing day! Everything went according to plan.', '2024-01-14 21:00:00'),
(1, 'neutral', 5, 'Average day, some work stress but managed well.', '2024-01-13 19:30:00'),
(2, 'good', 4, 'Pregnancy symptoms are manageable today. Feeling optimistic.', '2024-01-15 18:00:00'),
(2, 'bad', 7, 'Morning sickness was tough today. Need more rest.', '2024-01-14 20:00:00'),
(3, 'excellent', 1, 'Perfect day for outdoor activities! Went hiking and felt amazing.', '2024-01-15 19:00:00'),
(3, 'good', 3, 'Solid workout session. Making progress on fitness goals.', '2024-01-14 18:30:00');

-- Insert demo workouts
INSERT INTO workouts (user_id, exercise_type, duration, calories_burned, goal, date) VALUES
(1, 'Running', 30, 300, 'Cardio Health', '2024-01-15 06:30:00'),
(1, 'Weight Training', 45, 250, 'Muscle Building', '2024-01-14 17:00:00'),
(1, 'Cycling', 60, 400, 'Weight Loss', '2024-01-13 07:00:00'),
(2, 'Prenatal Yoga', 30, 120, 'Flexibility', '2024-01-15 10:00:00'),
(2, 'Walking', 25, 150, 'General Fitness', '2024-01-14 16:00:00'),
(3, 'Hiking', 90, 500, 'Endurance', '2024-01-15 08:00:00'),
(3, 'Swimming', 45, 350, 'Weight Loss', '2024-01-14 18:00:00'),
(3, 'Rock Climbing', 60, 400, 'Strength', '2024-01-13 14:00:00');

-- Insert demo medications
INSERT INTO medications (user_id, medicine_name, dosage, frequency, start_date, end_date, reminder_times) VALUES
(1, 'Lisinopril', '10mg', 'Once daily', '2024-01-01', '2024-12-31', '["08:00"]'),
(1, 'Vitamin D', '1000 IU', 'Daily', '2024-01-01', '2024-06-30', '["09:00"]'),
(1, 'Omega-3', '1000mg', 'Twice daily', '2024-01-01', '2024-03-31', '["08:00", "20:00"]'),
(2, 'Prenatal Vitamins', '1 tablet', 'Daily', '2024-01-01', '2024-10-01', '["09:00"]'),
(2, 'Iron Supplement', '65mg', 'Daily', '2024-01-01', '2024-10-01', '["12:00"]'),
(2, 'Insulin', '10 units', 'Before meals', '2024-01-01', '2024-12-31', '["07:30", "12:30", "18:30"]'),
(3, 'Multivitamin', '1 tablet', 'Daily', '2024-01-01', '2024-12-31', '["08:00"]'),
(3, 'Protein Powder', '1 scoop', 'Post-workout', '2024-01-01', '2024-06-30', '["19:00"]');

-- Insert demo emergency contacts
INSERT INTO emergency_contacts (user_id, name, relation, phone, location) VALUES
(1, 'Jane Doe', 'Spouse', '+1234567891', 'Same City'),
(1, 'Dr. Smith', 'Doctor', '+1234567800', 'City General Hospital'),
(1, 'Tom Doe', 'Brother', '+1234567892', 'Nearby Town'),
(2, 'Mike Johnson', 'Spouse', '+1234567893', 'Same City'),
(2, 'Dr. Williams', 'OB/GYN', '+1234567801', 'Women\'s Health Center'),
(2, 'Lisa Johnson', 'Sister', '+1234567896', 'Same City'),
(3, 'Emma Chen', 'Partner', '+1234567895', 'Same City'),
(3, 'Dr. Brown', 'Family Doctor', '+1234567802', 'Community Health Clinic'),
(3, 'David Chen', 'Father', '+1234567897', 'Another State');

-- Insert demo pregnancy data
INSERT INTO pregnancy_data (user_id, current_week, due_date, last_checkup, next_checkup, notes) VALUES
(2, 24, '2024-07-15', '2024-01-10', '2024-02-07', 'Everything progressing normally. Baby is healthy and active. Need to monitor blood sugar levels due to diabetes.');

-- Insert additional historical data for better charts
INSERT INTO meals (user_id, food_item, calories, protein, carbs, fats, meal_type, date) VALUES
-- Week data for user 1
(1, 'Scrambled Eggs', 220, 18.0, 2.0, 16.0, 'breakfast', '2024-01-12 08:00:00'),
(1, 'Chicken Wrap', 380, 25.0, 35.0, 15.0, 'lunch', '2024-01-12 12:30:00'),
(1, 'Beef Stir Fry', 450, 30.0, 20.0, 25.0, 'dinner', '2024-01-12 19:00:00'),
(1, 'Apple with Peanut Butter', 190, 4.0, 25.0, 8.0, 'snack', '2024-01-11 15:00:00'),
(1, 'Tuna Salad', 320, 28.0, 8.0, 18.0, 'lunch', '2024-01-11 13:00:00'),
(1, 'Pasta with Marinara', 420, 15.0, 65.0, 12.0, 'dinner', '2024-01-10 18:30:00');

INSERT INTO workouts (user_id, exercise_type, duration, calories_burned, goal, date) VALUES
-- Week data for user 1
(1, 'Yoga', 40, 180, 'Flexibility', '2024-01-12 07:00:00'),
(1, 'Running', 35, 320, 'Cardio Health', '2024-01-11 06:30:00'),
(1, 'Weight Training', 50, 280, 'Muscle Building', '2024-01-10 17:30:00'),
(1, 'Swimming', 30, 250, 'Cardio Health', '2024-01-09 18:00:00');

INSERT INTO mood_entries (user_id, mood, stress_level, journal_text, date) VALUES
-- Week data for user 1
(1, 'good', 4, 'Busy day at work but managed to get a good workout in.', '2024-01-12 20:30:00'),
(1, 'neutral', 6, 'Feeling a bit overwhelmed with deadlines.', '2024-01-11 19:00:00'),
(1, 'excellent', 2, 'Great start to the week! Feeling motivated.', '2024-01-10 21:00:00'),
(1, 'good', 3, 'Relaxing weekend. Spent time with family.', '2024-01-09 20:00:00');