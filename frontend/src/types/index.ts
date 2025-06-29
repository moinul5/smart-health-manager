export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  medicalHistory: string[];
  fitnessGoals: string[];
  pregnancyStatus: boolean;
  contactInfo: {
    phone: string;
    address: string;
    emergencyContact: string;
  };
  createdAt: Date;
}

export interface Meal {
  id: string;
  userId: string;
  foodItem: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  stressLevel: number; // 1-10
  journalText: string;
  date: Date;
}

export interface Workout {
  id: string;
  userId: string;
  exerciseType: string;
  duration: number; // minutes
  caloriesBurned: number;
  goal: string;
  date: Date;
}

export interface Medication {
  id: string;
  userId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate: Date;
  reminderTimes: string[];
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relation: string;
  phone: string;
  location: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  type: 'hospital' | 'pharmacy' | 'clinic';
}

export interface PregnancyData {
  id: string;
  userId: string;
  currentWeek: number;
  dueDate: Date;
  lastCheckup: Date;
  nextCheckup: Date;
  notes: string;
}

export interface DashboardData {
  todayMeals: Meal[];
  todayWorkouts: Workout[];
  todayMood: MoodEntry | null;
  upcomingMedications: Medication[];
  pregnancyInfo: PregnancyData | null;
}