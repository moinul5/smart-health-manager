import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Apple, 
  Brain, 
  Dumbbell, 
  Pill, 
  Heart,
  TrendingUp,
  Calendar,
  Target,
  Users,
  Loader2,
  RefreshCw,
  Baby
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHealth } from '../../context/HealthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { meals, moods, workouts, medications, pregnancyData, isLoading, loadUserData } = useHealth();

  // Check if user should see pregnancy section
  const shouldShowPregnancy = user && (
    user.gender === 'female' || 
    user.pregnancyStatus === true
  );

  // Calculate today's data
  const today = new Date();
  const todayMeals = meals.filter(meal => isToday(meal.date));
  const todayWorkouts = workouts.filter(workout => isToday(workout.date));
  const todayMood = moods.find(mood => isToday(mood.date));

  // Calculate nutrition data
  const todayNutrition = todayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const nutritionData = [
    { name: 'Protein', value: todayNutrition.protein, color: '#10B981' },
    { name: 'Carbs', value: todayNutrition.carbs, color: '#3B82F6' },
    { name: 'Fats', value: todayNutrition.fats, color: '#F59E0B' },
  ];

  // Calculate weekly mood data
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const moodValues = { excellent: 5, good: 4, neutral: 3, bad: 2, terrible: 1 };
  
  const weeklyMoodData = weekDays.map(day => {
    const dayMood = moods.find(mood => format(mood.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    return {
      day: format(day, 'EEE'),
      mood: dayMood ? moodValues[dayMood.mood] : 0,
      stress: dayMood ? dayMood.stressLevel : 0,
    };
  });

  // Calculate weekly workout data
  const weeklyWorkoutData = weekDays.map(day => {
    const dayWorkouts = workouts.filter(workout => 
      format(workout.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    const totalCalories = dayWorkouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
    const totalDuration = dayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
    
    return {
      day: format(day, 'EEE'),
      calories: totalCalories,
      duration: totalDuration,
    };
  });

  // Upcoming medications
  const upcomingMeds = medications.slice(0, 3);

  const stats = [
    {
      title: 'Today\'s Calories',
      value: todayNutrition.calories,
      icon: Apple,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900',
      change: `${todayMeals.length} meals`,
    },
    {
      title: 'Workouts This Week',
      value: workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      }).length,
      icon: Dumbbell,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900',
      change: `${todayWorkouts.length} today`,
    },
    {
      title: 'Current Mood',
      value: todayMood ? todayMood.mood.charAt(0).toUpperCase() + todayMood.mood.slice(1) : 'Not Set',
      icon: Brain,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900',
      change: todayMood ? `Stress: ${todayMood.stressLevel}/10` : 'Add mood entry',
    },
    {
      title: 'Active Medications',
      value: medications.length,
      icon: Pill,
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900',
      change: 'All current',
    },
  ];

  // Add pregnancy stat if applicable
  if (shouldShowPregnancy && pregnancyData) {
    stats.push({
      title: 'Pregnancy Week',
      value: pregnancyData.currentWeek,
      icon: Baby,
      color: 'text-pink-600',
      bg: 'bg-pink-100 dark:bg-pink-900',
      change: `Due: ${format(new Date(pregnancyData.dueDate), 'MMM dd')}`,
    });
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Loading Your Health Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch your latest health information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's your health summary for {format(today, 'EEEE, MMMM do, yyyy')}
            </p>
            {shouldShowPregnancy && pregnancyData && (
              <div className="mt-2 flex items-center space-x-2 text-pink-600 dark:text-pink-400">
                <Baby className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Week {pregnancyData.currentWeek} of pregnancy • Due {format(new Date(pregnancyData.dueDate), 'MMM dd, yyyy')}
                </span>
              </div>
            )}
          </div>
          <Button
            onClick={loadUserData}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </Button>
        </div>
      </motion.div>

      {/* Data Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Health Data Status
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {meals.length} meals • {moods.length} mood entries • {workouts.length} workouts • {medications.length} medications
                  {shouldShowPregnancy && pregnancyData && ` • Pregnancy tracking active`}
                </p>
              </div>
            </div>
            <div className="text-emerald-600 dark:text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${shouldShowPregnancy && pregnancyData ? '5' : '4'} gap-6 mb-8`}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card hover className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Nutrition Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Nutrition Breakdown
            </h3>
            <div className="h-64">
              {todayNutrition.calories > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nutritionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}g`}
                    >
                      {nutritionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No meals logged today</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Add your first meal to see nutrition breakdown</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Mood Tracking */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Mood & Stress Levels
            </h3>
            <div className="h-64">
              {moods.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyMoodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Mood (1-5)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stress" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Stress (1-10)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No mood entries yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Track your mood to see trends</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Fitness Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Fitness Activity
          </h3>
          <div className="h-64">
            {workouts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyWorkoutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#3B82F6" name="Calories Burned" />
                  <Bar dataKey="duration" fill="#10B981" name="Duration (min)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No workouts logged yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Start tracking your fitness activities</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Meals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Meals
            </h3>
            <div className="space-y-3">
              {todayMeals.length > 0 ? (
                todayMeals.slice(0, 4).map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{meal.foodItem}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{meal.mealType}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">{meal.calories} cal</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Apple className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No meals logged today
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Medication Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Medication Reminders
            </h3>
            <div className="space-y-3">
              {upcomingMeds.length > 0 ? (
                upcomingMeds.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{med.medicineName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{med.dosage} - {med.frequency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {med.reminderTimes[0] || 'No time set'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Pill className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No medications scheduled
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;