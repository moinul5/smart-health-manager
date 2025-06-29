import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Dumbbell, Plus, Target, TrendingUp, Activity, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import toast from 'react-hot-toast';

const schema = yup.object({
  exerciseType: yup.string().required('Exercise type is required'),
  duration: yup.number().min(1, 'Duration must be positive').required('Duration is required'),
  caloriesBurned: yup.number().min(0, 'Calories cannot be negative').required('Calories burned is required'),
  goal: yup.string().required('Goal is required'),
});

interface WorkoutForm {
  exerciseType: string;
  duration: number;
  caloriesBurned: number;
  goal: string;
}

const Fitness: React.FC = () => {
  const { user } = useAuth();
  const { workouts, addWorkout } = useHealth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm<WorkoutForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      exerciseType: '',
      duration: 0,
      caloriesBurned: 0,
      goal: '',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: WorkoutForm) => {
    setIsSubmitting(true);
    try {
      console.log('💪 Submitting workout data:', data);
      
      // Show loading toast
      const loadingToast = toast.loading('Adding workout...');
      
      await addWorkout({
        ...data,
        userId: user!.id,
        date: new Date(),
      });
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Workout logged successfully!</span>
        </div>,
        { duration: 3000 }
      );
      
      reset();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('❌ Error adding workout:', error);
      toast.error(
        <div>
          <div className="font-medium">Failed to log workout</div>
          <div className="text-sm text-gray-600">{error.message || 'Please try again'}</div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick workout presets for better UX
  const quickWorkouts = [
    { name: 'Morning Run', type: 'Running', duration: 30, calories: 300, goal: 'Cardio Health' },
    { name: 'Weight Training', type: 'Weight Training', duration: 45, calories: 250, goal: 'Muscle Building' },
    { name: 'Yoga Session', type: 'Yoga', duration: 40, calories: 180, goal: 'Flexibility' },
    { name: 'HIIT Workout', type: 'HIIT', duration: 25, calories: 350, goal: 'Weight Loss' },
    { name: 'Swimming', type: 'Swimming', duration: 45, calories: 400, goal: 'Endurance' },
    { name: 'Cycling', type: 'Cycling', duration: 60, calories: 450, goal: 'Cardio Health' },
  ];

  const fillQuickWorkout = (workout: any) => {
    setValue('exerciseType', workout.type, { shouldValidate: true });
    setValue('duration', workout.duration, { shouldValidate: true });
    setValue('caloriesBurned', workout.calories, { shouldValidate: true });
    setValue('goal', workout.goal, { shouldValidate: true });
    clearErrors(); // Clear any existing errors
    toast.success(`Quick workout "${workout.name}" loaded!`);
  };

  // Calculate today's workouts
  const todayWorkouts = workouts.filter(workout => isToday(workout.date));
  const todayStats = todayWorkouts.reduce(
    (acc, workout) => ({
      totalDuration: acc.totalDuration + workout.duration,
      totalCalories: acc.totalCalories + workout.caloriesBurned,
      workoutCount: acc.workoutCount + 1,
    }),
    { totalDuration: 0, totalCalories: 0, workoutCount: 0 }
  );

  // Weekly workout data
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyWorkoutData = weekDays.map(day => {
    const dayWorkouts = workouts.filter(workout => 
      format(workout.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    return {
      day: format(day, 'EEE'),
      duration: dayWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
      calories: dayWorkouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0),
      count: dayWorkouts.length,
    };
  });

  // Exercise type distribution
  const exerciseTypes = workouts.reduce((acc, workout) => {
    acc[workout.exerciseType] = (acc[workout.exerciseType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exerciseTypeData = Object.entries(exerciseTypes).map(([type, count], index) => ({
    name: type,
    value: count,
    color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6],
  }));

  // Goals progress (mock data for demo)
  const fitnessGoals = [
    { goal: 'Lose 5kg', current: 2.5, target: 5, unit: 'kg', color: '#10B981' },
    { goal: 'Run 100km/month', current: 45, target: 100, unit: 'km', color: '#3B82F6' },
    { goal: 'Workout 20 days/month', current: 12, target: 20, unit: 'days', color: '#F59E0B' },
  ];

  const exerciseOptions = [
    'Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'Pilates',
    'Dancing', 'Basketball', 'Tennis', 'Soccer', 'Boxing', 'Hiking', 'Rowing', 'HIIT'
  ];

  const goalOptions = [
    'Weight Loss', 'Muscle Building', 'Endurance', 'Flexibility', 'Strength',
    'Cardio Health', 'Stress Relief', 'General Fitness'
  ];

  // Reset form and set defaults when modal opens
  const handleModalOpen = () => {
    setIsModalOpen(true);
    reset({
      exerciseType: '',
      duration: 0,
      caloriesBurned: 0,
      goal: '',
    });
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      reset();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fitness Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your workouts and monitor your fitness progress
            </p>
          </div>
          <Button
            onClick={handleModalOpen}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Log Workout</span>
          </Button>
        </div>
      </motion.div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Workouts Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayStats.workoutCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {todayStats.totalDuration} minutes total
                </p>
              </div>
              <Activity className="h-8 w-8 text-emerald-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayStats.totalDuration}m</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round(todayStats.totalDuration / 60 * 10) / 10} hours
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Calories Burned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayStats.totalCalories}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Today's total
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weekly Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {weeklyWorkoutData.reduce((sum, day) => sum + day.count, 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This week
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Fitness Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Fitness Goals Progress
          </h3>
          <div className="space-y-4">
            {fitnessGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{goal.goal}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round((goal.current / goal.target) * 100)}% completed
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Workout Activity
            </h3>
            <div className="h-64">
              {workouts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyWorkoutData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="duration" fill="#10B981" name="Duration (min)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="calories" fill="#3B82F6" name="Calories Burned" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No workouts logged yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Start your fitness journey today!</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Exercise Type Distribution
            </h3>
            <div className="h-64">
              {exerciseTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exerciseTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {exerciseTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No workout data available yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Log your first workout to see the breakdown</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Workouts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Workouts
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{workouts.length} total workouts</span>
            </div>
          </div>
          {workouts.length > 0 ? (
            <div className="space-y-4">
              {workouts.slice(0, 5).map((workout) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Dumbbell className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{workout.exerciseType}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                          Goal: {workout.goal}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(workout.date, 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white text-lg">{workout.duration} min</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{workout.caloriesBurned} cal burned</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No workouts logged yet</p>
              <p className="text-gray-400 dark:text-gray-500 mb-6">Start your fitness journey by logging your first workout!</p>
              <Button
                onClick={handleModalOpen}
                className="flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Log Your First Workout</span>
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Enhanced Log Workout Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Log New Workout"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quick Workout Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Workout Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickWorkouts.map((workout, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillQuickWorkout(workout)}
                  disabled={isSubmitting}
                  className="text-left p-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{workout.name}</div>
                  <div className="text-gray-600 dark:text-gray-400">{workout.duration}min • {workout.calories} cal</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exercise Type
              </label>
              <select
                {...register('exerciseType')}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onChange={(e) => {
                  e.preventDefault();
                  setValue('exerciseType', e.target.value, { shouldValidate: true });
                }}
              >
                <option value="">Select exercise type</option>
                {exerciseOptions.map(exercise => (
                  <option key={exercise} value={exercise}>{exercise}</option>
                ))}
              </select>
              {errors.exerciseType && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.exerciseType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Duration (minutes)"
                type="number"
                min="0"
                step="1"
                {...register('duration', { valueAsNumber: true })}
                error={errors.duration?.message}
                disabled={isSubmitting}
                placeholder="0"
              />

              <Input
                label="Calories Burned"
                type="number"
                min="0"
                step="1"
                {...register('caloriesBurned', { valueAsNumber: true })}
                error={errors.caloriesBurned?.message}
                disabled={isSubmitting}
                placeholder="0"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fitness Goal
              </label>
              <select
                {...register('goal')}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onChange={(e) => {
                  e.preventDefault();
                  setValue('goal', e.target.value, { shouldValidate: true });
                }}
              >
                <option value="">Select goal</option>
                {goalOptions.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
              {errors.goal && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.goal.message}</p>
              )}
            </div>

            {/* Workout Preview */}
            {(watchedValues.duration > 0 || watchedValues.caloriesBurned > 0) && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Workout Preview
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-blue-700 dark:text-blue-300">{watchedValues.duration || 0}</div>
                    <div className="text-blue-600 dark:text-blue-400">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-700 dark:text-blue-300">{watchedValues.caloriesBurned || 0}</div>
                    <div className="text-blue-600 dark:text-blue-400">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-700 dark:text-blue-300">
                      {watchedValues.caloriesBurned && watchedValues.duration ? 
                        Math.round(watchedValues.caloriesBurned / watchedValues.duration) : 0}
                    </div>
                    <div className="text-blue-600 dark:text-blue-400">Cal/Min</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 flex items-center justify-center space-x-2" 
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Logging Workout...</span>
                </>
              ) : (
                <>
                  <Dumbbell className="h-4 w-4" />
                  <span>Log Workout</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleModalClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fitness;