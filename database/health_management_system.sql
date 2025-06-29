-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2025 at 11:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `health_management_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `emergency_contacts`
--

CREATE TABLE `emergency_contacts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `relation` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emergency_contacts`
--

INSERT INTO `emergency_contacts` (`id`, `user_id`, `name`, `relation`, `phone`, `location`, `created_at`) VALUES
(4, 2, 'Mike Johnson', 'Spouse', '+1234567893', 'Same City', '2025-06-17 13:04:14'),
(5, 2, 'Dr. Williams', 'OB/GYN', '+1234567801', 'Women\'s Health Center', '2025-06-17 13:04:14'),
(6, 2, 'Lisa Johnson', 'Sister', '+1234567896', 'Same City', '2025-06-17 13:04:14'),
(7, 3, 'Emma Chen', 'Partner', '+1234567895', 'Same City', '2025-06-17 13:04:14'),
(8, 3, 'Dr. Brown', 'Family Doctor', '+1234567802', 'Community Health Clinic', '2025-06-17 13:04:14'),
(9, 3, 'David Chen', 'Father', '+1234567897', 'Another State', '2025-06-17 13:04:14');

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `food_item` varchar(255) NOT NULL,
  `calories` int(11) NOT NULL,
  `protein` decimal(5,2) NOT NULL,
  `carbs` decimal(5,2) NOT NULL,
  `fats` decimal(5,2) NOT NULL,
  `meal_type` enum('breakfast','lunch','dinner','snack') NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`id`, `user_id`, `food_item`, `calories`, `protein`, `carbs`, `fats`, `meal_type`, `date`) VALUES
(1, 1, 'Grilled Chicken Salad', 350, 30.00, 15.00, 18.00, 'lunch', '2024-01-15 06:30:00'),
(2, 1, 'Oatmeal with Berries', 280, 8.00, 45.00, 6.00, 'breakfast', '2024-01-15 02:00:00'),
(3, 1, 'Salmon with Quinoa', 420, 35.00, 25.00, 20.00, 'dinner', '2024-01-14 13:00:00'),
(4, 1, 'Greek Yogurt', 150, 15.00, 12.00, 5.00, 'snack', '2024-01-14 09:30:00'),
(5, 2, 'Avocado Toast', 320, 12.00, 35.00, 18.00, 'breakfast', '2024-01-15 03:00:00'),
(6, 2, 'Quinoa Buddha Bowl', 380, 18.00, 45.00, 15.00, 'lunch', '2024-01-15 07:00:00'),
(7, 3, 'Protein Smoothie', 250, 25.00, 20.00, 8.00, 'breakfast', '2024-01-15 01:30:00'),
(8, 3, 'Turkey Sandwich', 340, 28.00, 30.00, 12.00, 'lunch', '2024-01-15 06:00:00'),
(9, 1, 'Scrambled Eggs', 220, 18.00, 2.00, 16.00, 'breakfast', '2024-01-12 02:00:00'),
(10, 1, 'Chicken Wrap', 380, 25.00, 35.00, 15.00, 'lunch', '2024-01-12 06:30:00'),
(11, 1, 'Beef Stir Fry', 450, 30.00, 20.00, 25.00, 'dinner', '2024-01-12 13:00:00'),
(12, 1, 'Apple with Peanut Butter', 190, 4.00, 25.00, 8.00, 'snack', '2024-01-11 09:00:00'),
(13, 1, 'Tuna Salad', 320, 28.00, 8.00, 18.00, 'lunch', '2024-01-11 07:00:00'),
(14, 7, 'Pasta with Marinara', 420, 15.00, 65.00, 12.00, 'dinner', '2024-01-10 12:30:00'),
(15, 1, 'Grilled chicken', 232, 32.00, 323.00, 323.00, 'lunch', '2025-06-20 17:40:20'),
(16, 1, 'Grilled chicken', 211, 32.00, 323.00, 32.00, 'lunch', '2025-06-20 17:48:05'),
(17, 1, 'Grilled chicken', 23, 232.00, 323.00, 3.00, 'lunch', '2025-06-20 17:48:39'),
(18, 1, 'Greek Yogurt', 150, 15.00, 12.00, 5.00, 'snack', '2025-06-20 18:03:56'),
(19, 1, 'Protein Smoothie', 250, 25.00, 20.00, 8.00, 'snack', '2025-06-21 00:21:26'),
(20, 1, 'Grilled Chicken Salad', 350, 30.00, 15.00, 18.00, 'lunch', '2025-06-21 00:21:47'),
(21, 1, 'Greek Yogurt', 150, 15.00, 12.00, 5.00, 'snack', '2025-06-21 00:45:05'),
(22, 1, 'Salmon with Quinoa', 420, 35.00, 25.00, 20.00, 'dinner', '2025-06-22 10:36:57');

-- --------------------------------------------------------

--
-- Table structure for table `medications`
--

CREATE TABLE `medications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `medicine_name` varchar(255) NOT NULL,
  `dosage` varchar(100) NOT NULL,
  `frequency` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reminder_times` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reminder_times`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medications`
--

INSERT INTO `medications` (`id`, `user_id`, `medicine_name`, `dosage`, `frequency`, `start_date`, `end_date`, `reminder_times`, `created_at`) VALUES
(4, 2, 'Prenatal Vitamins', '1 tablet', 'Daily', '2024-01-01', '2024-10-01', '[\"09:00\"]', '2025-06-17 13:04:14'),
(5, 2, 'Iron Supplement', '65mg', 'Daily', '2024-01-01', '2024-10-01', '[\"12:00\"]', '2025-06-17 13:04:14'),
(6, 2, 'Insulin', '10 units', 'Before meals', '2024-01-01', '2024-12-31', '[\"07:30\", \"12:30\", \"18:30\"]', '2025-06-17 13:04:14'),
(7, 3, 'Multivitamin', '1 tablet', 'Daily', '2024-01-01', '2024-12-31', '[\"08:00\"]', '2025-06-17 13:04:14'),
(8, 3, 'Protein Powder', '1 scoop', 'Post-workout', '2024-01-01', '2024-06-30', '[\"19:00\"]', '2025-06-17 13:04:14'),
(10, 1, 'Napa', '100', 'Once daily', '2025-06-22', '2025-06-28', '[\"8:00\"]', '2025-06-22 17:07:34');

-- --------------------------------------------------------

--
-- Table structure for table `mood_entries`
--

CREATE TABLE `mood_entries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mood` enum('excellent','good','neutral','bad','terrible') NOT NULL,
  `stress_level` int(11) DEFAULT NULL CHECK (`stress_level` >= 1 and `stress_level` <= 10),
  `journal_text` text DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mood_entries`
--

INSERT INTO `mood_entries` (`id`, `user_id`, `mood`, `stress_level`, `journal_text`, `date`) VALUES
(1, 1, 'good', 3, 'Feeling productive today! Had a great workout and healthy meals.', '2024-01-15 14:00:00'),
(2, 1, 'excellent', 2, 'Amazing day! Everything went according to plan.', '2024-01-14 15:00:00'),
(3, 1, 'neutral', 5, 'Average day, some work stress but managed well.', '2024-01-13 13:30:00'),
(4, 2, 'good', 4, 'Pregnancy symptoms are manageable today. Feeling optimistic.', '2024-01-15 12:00:00'),
(5, 2, 'bad', 7, 'Morning sickness was tough today. Need more rest.', '2024-01-14 14:00:00'),
(6, 3, 'excellent', 1, 'Perfect day for outdoor activities! Went hiking and felt amazing.', '2024-01-15 13:00:00'),
(7, 3, 'good', 3, 'Solid workout session. Making progress on fitness goals.', '2024-01-14 12:30:00'),
(8, 1, 'good', 4, 'Busy day at work but managed to get a good workout in.', '2024-01-12 14:30:00'),
(9, 1, 'neutral', 6, 'Feeling a bit overwhelmed with deadlines.', '2024-01-11 13:00:00'),
(10, 1, 'excellent', 2, 'Great start to the week! Feeling motivated.', '2024-01-10 15:00:00'),
(11, 1, 'good', 3, 'Relaxing weekend. Spent time with family.', '2024-01-09 14:00:00'),
(12, 1, 'excellent', 5, 'good\n', '2025-06-21 11:04:26'),
(13, 1, 'excellent', 10, 'assignment', '2025-06-22 10:38:26'),
(14, 1, 'neutral', 5, 'not bad\n', '2025-06-22 11:05:08'),
(15, 1, 'bad', 10, 'not good\n', '2025-06-22 23:38:46');

-- --------------------------------------------------------

--
-- Table structure for table `pregnancy_data`
--

CREATE TABLE `pregnancy_data` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `current_week` int(11) NOT NULL CHECK (`current_week` >= 1 and `current_week` <= 42),
  `due_date` date NOT NULL,
  `last_checkup` date DEFAULT NULL,
  `next_checkup` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pregnancy_data`
--

INSERT INTO `pregnancy_data` (`id`, `user_id`, `current_week`, `due_date`, `last_checkup`, `next_checkup`, `notes`, `created_at`, `updated_at`) VALUES
(1, 2, 24, '2024-07-15', '2024-01-10', '2024-02-07', 'Everything progressing normally. Baby is healthy and active. Need to monitor blood sugar levels due to diabetes.', '2025-06-17 13:04:14', '2025-06-17 13:04:14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT 0,
  `gender` enum('male','female','other') DEFAULT 'other',
  `height` decimal(5,2) DEFAULT 0.00,
  `weight` decimal(5,2) DEFAULT 0.00,
  `medical_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`medical_history`)),
  `fitness_goals` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fitness_goals`)),
  `pregnancy_status` tinyint(1) DEFAULT 0,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `age`, `gender`, `height`, `weight`, `medical_history`, `fitness_goals`, `pregnancy_status`, `phone`, `address`, `emergency_contact`, `created_at`, `updated_at`) VALUES
(1, 'Alfi', 'demo@healthcare.com', '$2y$10$.jlTRKItOgfY1tWadz3zDuWEUgPoAp426cpRrnIN4OfeQows.DKBm', 25, 'male', 180.00, 70.00, '[\"Hypertension\",\"Over weight\"]', '[\"Weight Loss\",\"stay fit\"]', 0, '+1234567890', 'Dhaka, Bangladesh', 'Moinul', '2025-06-17 13:04:14', '2025-06-21 19:06:34'),
(2, 'Sarah Johnson', 'sarah@healthcare.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 28, 'female', 165.00, 60.00, '[\"Diabetes Type 1\"]', '[\"Flexibility\", \"Stress Relief\", \"General Fitness\"]', 1, '+1234567892', '456 Wellness Ave, Health Town, HT 67890', 'Mike Johnson - +1234567893', '2025-06-17 13:04:14', '2025-06-17 13:04:14'),
(3, 'Alex Chen', 'alex@healthcare.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 35, 'other', 170.00, 65.00, '[]', '[\"Endurance\", \"Weight Loss\"]', 0, '+1234567894', '789 Fitness Blvd, Active City, AC 13579', 'Emma Chen - +1234567895', '2025-06-17 13:04:14', '2025-06-17 13:04:14'),
(4, 'Moinul Islam', 'moinul@healthcare.com', '$2y$10$w7Z9u0/O9b.vPwmAPE4/guWv1s6FKHDDiqHup5AcNjSoSm2Suj6b.', 26, 'male', 172.00, 68.50, '[\"No known conditions\"]', '[\"Build Strength\", \"Stay Fit\"]', 0, '+8801712345678', '99 Test Lane, Dhaka, Bangladesh', 'Emergency Contact - +8801912345678', '2025-06-18 06:25:18', '2025-06-18 06:51:38'),
(7, 'Moinul Islam', 'moinul12@healthcare.com', '$2y$10$.jlTRKItOgfY1tWadz3zDuWEUgPoAp426cpRrnIN4OfeQows.DKBm', 24, 'male', 171.00, 38.00, '[\"None\"]', '[\"Strength\"]', 0, '+8801712345678', 'Dhaka, Bangladesh', 'Mother - +8801912345678', '2025-06-18 06:58:57', '2025-06-20 10:18:08'),
(9, 'Moinul Islam', 'moinul112@healthcare.com', '$2y$10$XMZdH9tiAPdHHAMoApRRiupG7rPa6x6R1FqsJuR5Q4BOLU6IR9x4C', 26, 'male', 172.50, 68.50, '[\"None\"]', '[\"Strength\"]', 0, '+8801712345678', 'Dhaka, Bangladesh', 'Mother - +8801912345678', '2025-06-19 09:13:45', '2025-06-19 09:13:45'),
(11, 'S.M. Rashed', 'mi047776@gmail.com', '$2y$10$UuQCmk/NeWpxpI778/KaLemF9WXtogoq4LBGbzI06iqwWIVMjlPx2', 25, 'other', 170.00, 70.00, '[]', '[]', 0, '01822688827', 'Dhaka, Bangladesh', '', '2025-06-19 09:46:03', '2025-06-19 09:46:03'),
(15, 'Moinul Islam', 'moinul122@healthcare.com', '$2y$10$lDFc1hzWJ1Rw6.OT7BJKDO6pEGwvVNyBRo7ukwSoFlCewSm43uzgq', 25, 'other', 170.00, 70.00, '[]', '[]', 0, '01822688827', '1, Friend Row, Jadavpur, Friends Row, Naskarpara, Santoshpur', '', '2025-06-19 09:46:45', '2025-06-19 09:46:45'),
(25, 'Moinul Islam', 'moinul4039@gmail.com', '$2y$10$pJoLNOxnI5C5yhGpzDCMvuo7ED47SSIhsw6DBpq6feYusOHuE6jN.', 21, 'other', 170.00, 70.00, '[]', '[]', 0, '+8801712345678', 'Dhaka, Bangladesh', 'Mother - +42942092340802384', '2025-06-20 05:47:32', '2025-06-20 05:48:14'),
(27, 'Moinul Islam', 'demo1@healthcare.com', '$2y$10$P6zkZJn62OaKXfOlp6QtGeNNDhvyIpDGjtRc5tE9nl9dBHtT4ZI/a', 25, 'other', 170.00, 70.00, '[]', '[]', 0, '01822688827', 'Dhaka, Bangladesh', '', '2025-06-20 10:22:07', '2025-06-20 10:22:07'),
(31, 'Muntahina', 'muntakima@gmail.com', '$2y$10$twjOazx5DmZPkEtLpiAeOuTRysXt/qBlThbxRnlF1ocYBMKt32j2C', 25, 'other', 170.00, 70.00, '[]', '[]', 0, '54569', 'daha', '', '2025-06-23 05:50:35', '2025-06-23 05:50:35'),
(32, 'Muntahina', 'muntakima1@gmail.com', '$2y$10$M3ej9T3EUoLnBptWTVNnbedJCMlXsmH1rzW3qD8O9VeoK1NYxcEcC', 25, 'female', 170.00, 70.00, '[]', '[]', 0, '233245425', 'dhaka', '', '2025-06-23 05:51:38', '2025-06-23 05:51:38');

-- --------------------------------------------------------

--
-- Table structure for table `workouts`
--

CREATE TABLE `workouts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `exercise_type` varchar(100) NOT NULL,
  `duration` int(11) NOT NULL,
  `calories_burned` int(11) NOT NULL,
  `goal` varchar(100) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workouts`
--

INSERT INTO `workouts` (`id`, `user_id`, `exercise_type`, `duration`, `calories_burned`, `goal`, `date`) VALUES
(1, 1, 'Running', 30, 300, 'Cardio Health', '2025-06-21 00:30:00'),
(2, 1, 'Weight Training', 45, 250, 'Muscle Building', '2024-01-14 11:00:00'),
(3, 1, 'Cycling', 60, 400, 'Weight Loss', '2024-01-13 01:00:00'),
(4, 2, 'Prenatal Yoga', 30, 120, 'Flexibility', '2024-01-15 04:00:00'),
(5, 2, 'Walking', 25, 150, 'General Fitness', '2024-01-14 10:00:00'),
(6, 3, 'Hiking', 90, 500, 'Endurance', '2024-01-15 02:00:00'),
(7, 3, 'Swimming', 45, 350, 'Weight Loss', '2024-01-14 12:00:00'),
(8, 3, 'Rock Climbing', 60, 400, 'Strength', '2024-01-13 08:00:00'),
(9, 1, 'Yoga', 40, 180, 'Flexibility', '2024-01-12 01:00:00'),
(10, 1, 'Running', 35, 320, 'Cardio Health', '2024-01-11 00:30:00'),
(11, 1, 'Weight Training', 50, 280, 'Muscle Building', '2024-01-10 11:30:00'),
(12, 1, 'Swimming', 30, 250, 'Cardio Health', '2024-01-09 12:00:00'),
(13, 1, 'Running', 30, 300, 'Cardio Health', '2025-06-21 11:13:51'),
(14, 1, 'HIIT', 25, 350, 'Weight Loss', '2025-06-21 11:14:01'),
(15, 1, 'Running', 30, 300, 'Cardio Health', '2025-06-22 10:39:38'),
(16, 1, 'Swimming', 45, 400, 'Endurance', '2025-06-22 11:05:58'),
(17, 1, 'Yoga', 40, 180, 'Flexibility', '2025-06-22 11:06:34'),
(18, 1, 'Running', 30, 300, 'Cardio Health', '2025-06-22 23:38:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_emergency_contacts_user` (`user_id`);

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_meals_user_date` (`user_id`,`date`);

--
-- Indexes for table `medications`
--
ALTER TABLE `medications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_medications_user` (`user_id`);

--
-- Indexes for table `mood_entries`
--
ALTER TABLE `mood_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mood_entries_user_date` (`user_id`,`date`);

--
-- Indexes for table `pregnancy_data`
--
ALTER TABLE `pregnancy_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pregnancy_data_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `workouts`
--
ALTER TABLE `workouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_workouts_user_date` (`user_id`,`date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `medications`
--
ALTER TABLE `medications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `mood_entries`
--
ALTER TABLE `mood_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pregnancy_data`
--
ALTER TABLE `pregnancy_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `workouts`
--
ALTER TABLE `workouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  ADD CONSTRAINT `emergency_contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meals`
--
ALTER TABLE `meals`
  ADD CONSTRAINT `meals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `medications`
--
ALTER TABLE `medications`
  ADD CONSTRAINT `medications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mood_entries`
--
ALTER TABLE `mood_entries`
  ADD CONSTRAINT `mood_entries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pregnancy_data`
--
ALTER TABLE `pregnancy_data`
  ADD CONSTRAINT `pregnancy_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `workouts`
--
ALTER TABLE `workouts`
  ADD CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
