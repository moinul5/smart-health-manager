import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Apple, Plus, Calendar, TrendingUp, Utensils, CheckCircle, Clock } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import toast from 'react-hot-toast';

const schema = yup.object({
  foodItem: yup.string().required('Food item is required'),
  calories: yup.number().min(1, 'Calories must be positive').required('Calories are required'),
  protein: yup.number().min(0, 'Protein cannot be negative').required('Protein is required'),
  carbs: yup.number().min(0, 'Carbs cannot be negative').required('Carbs are required'),
  fats: yup.number().min(0, 'Fats cannot be negative').required('Fats are required'),
  mealType: yup.string().oneOf(['breakfast', 'lunch', 'dinner', 'snack']).required('Meal type is required'),
});

interface MealForm {
  foodItem: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const Nutrition: React.FC = () => {
  const { user } = useAuth();
  const { meals, addMeal } = useHealth();
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
  } = useForm<MealForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      foodItem: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealType: 'breakfast',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: MealForm) => {
    setIsSubmitting(true);
    try {
      console.log('🍽️ Submitting meal data:', data);
      
      // Show loading toast
      const loadingToast = toast.loading('Adding meal...');
      
      await addMeal({
        ...data,
        userId: user!.id,
        date: new Date(),
      });
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Meal added successfully!</span>
        </div>,
        { duration: 3000 }
      );
      
      reset();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('❌ Error adding meal:', error);
      toast.error(
        <div>
          <div className="font-medium">Failed to add meal</div>
          <div className="text-sm text-gray-600">{error.message || 'Please try again'}</div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick meal presets for better UX
  const quickMeals = [
    { name: 'Grilled Chicken Salad', calories: 350, protein: 30, carbs: 15, fats: 18, type: 'lunch' },
    { name: 'Oatmeal with Berries', calories: 280, protein: 8, carbs: 45, fats: 6, type: 'breakfast' },
    { name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 12, fats: 5, type: 'snack' },
    { name: 'Salmon with Quinoa', calories: 420, protein: 35, carbs: 25, fats: 20, type: 'dinner' },
    { name: 'Avocado Toast', calories: 320, protein: 12, carbs: 35, fats: 18, type: 'breakfast' },
    { name: 'Protein Smoothie', calories: 250, protein: 25, carbs: 20, fats: 8, type: 'snack' },
  ];

  const fillQuickMeal = (meal: any) => {
    setValue('foodItem', meal.name, { shouldValidate: true });
    setValue('calories', meal.calories, { shouldValidate: true });
    setValue('protein', meal.protein, { shouldValidate: true });
    setValue('carbs', meal.carbs, { shouldValidate: true });
    setValue('fats', meal.fats, { shouldValidate: true });
    setValue('mealType', meal.type as any, { shouldValidate: true });
    clearErrors(); // Clear any existing errors
    toast.success(`Quick meal "${meal.name}" loaded!`);
  };

  // Calculate today's nutrition
  const todayMeals = meals.filter(meal => isToday(meal.date));
  const todayNutrition = todayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // Nutrition breakdown for pie chart
  const nutritionData = [
    { name: 'Protein', value: todayNutrition.protein, color: '#10B981' },
    { name: 'Carbs', value: todayNutrition.carbs, color: '#3B82F6' },
    { name: 'Fats', value: todayNutrition.fats, color: '#F59E0B' },
  ];

  // Weekly calories data
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyCaloriesData = weekDays.map(day => {
    const dayMeals = meals.filter(meal => 
      format(meal.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    return {
      day: format(day, 'EEE'),
      calories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
    };
  });

  // Get current meal type suggestion based on time
  const getCurrentMealType = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'breakfast';
    if (hour < 15) return 'lunch';
    if (hour < 19) return 'dinner';
    return 'snack';
  };

  // Reset form and set defaults when modal opens
  const handleModalOpen = () => {
    setIsModalOpen(true);
    // Reset form with proper defaults
    reset({
      foodItem: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealType: getCurrentMealType() as any,
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nutrition Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your meals and monitor your nutritional intake
            </p>
          </div>
          <Button
            onClick={handleModalOpen}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Meal</span>
          </Button>
        </div>
      </motion.div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Calories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayNutrition.calories}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {todayMeals.length} meals today
                </p>
              </div>
              <Apple className="h-8 w-8 text-red-500" />
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Protein</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayNutrition.protein}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((todayNutrition.protein * 4 / todayNutrition.calories) * 100) || 0}% of calories
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Carbs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayNutrition.carbs}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((todayNutrition.carbs * 4 / todayNutrition.calories) * 100) || 0}% of calories
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fats</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayNutrition.fats}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((todayNutrition.fats * 9 / todayNutrition.calories) * 100) || 0}% of calories
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
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
                    <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No meals logged today</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Add your first meal to see the breakdown</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Calorie Intake
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyCaloriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Today's Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today's Meals
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(), 'EEEE, MMM dd')}</span>
            </div>
          </div>
          {todayMeals.length > 0 ? (
            <div className="space-y-4">
              {todayMeals.map((meal) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{meal.foodItem}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                          {meal.mealType}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(meal.date, 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white text-lg">{meal.calories} cal</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No meals logged today</p>
              <p className="text-gray-400 dark:text-gray-500 mb-6">Start tracking your nutrition by adding your first meal!</p>
              <Button
                onClick={handleModalOpen}
                className="flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Meal</span>
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Enhanced Add Meal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Add New Meal"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quick Meal Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Meal Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickMeals.map((meal, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillQuickMeal(meal)}
                  disabled={isSubmitting}
                  className="text-left p-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{meal.name}</div>
                  <div className="text-gray-600 dark:text-gray-400">{meal.calories} cal</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <Input
              label="Food Item"
              {...register('foodItem')}
              error={errors.foodItem?.message}
              placeholder="e.g., Grilled Chicken Salad"
              disabled={isSubmitting}
              autoFocus={false}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Calories"
                type="number"
                min="0"
                step="1"
                {...register('calories', { valueAsNumber: true })}
                error={errors.calories?.message}
                disabled={isSubmitting}
                placeholder="0"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meal Type
                </label>
                <select
                  {...register('mealType')}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) => {
                    // Prevent form submission on change
                    e.preventDefault();
                    setValue('mealType', e.target.value as any, { shouldValidate: true });
                  }}
                >
                  <option value="breakfast">🌅 Breakfast</option>
                  <option value="lunch">☀️ Lunch</option>
                  <option value="dinner">🌙 Dinner</option>
                  <option value="snack">🍎 Snack</option>
                </select>
                {errors.mealType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.mealType.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <Input
                label="Protein (g)"
                type="number"
                min="0"
                step="0.1"
                {...register('protein', { valueAsNumber: true })}
                error={errors.protein?.message}
                disabled={isSubmitting}
                placeholder="0"
              />

              <Input
                label="Carbs (g)"
                type="number"
                min="0"
                step="0.1"
                {...register('carbs', { valueAsNumber: true })}
                error={errors.carbs?.message}
                disabled={isSubmitting}
                placeholder="0"
              />

              <Input
                label="Fats (g)"
                type="number"
                min="0"
                step="0.1"
                {...register('fats', { valueAsNumber: true })}
                error={errors.fats?.message}
                disabled={isSubmitting}
                placeholder="0"
              />
            </div>

            {/* Nutrition Preview */}
            {(watchedValues.calories > 0 || watchedValues.protein > 0 || watchedValues.carbs > 0 || watchedValues.fats > 0) && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">
                  Nutrition Preview
                </h4>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-emerald-700 dark:text-emerald-300">{watchedValues.calories || 0}</div>
                    <div className="text-emerald-600 dark:text-emerald-400">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-emerald-700 dark:text-emerald-300">{watchedValues.protein || 0}g</div>
                    <div className="text-emerald-600 dark:text-emerald-400">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-emerald-700 dark:text-emerald-300">{watchedValues.carbs || 0}g</div>
                    <div className="text-emerald-600 dark:text-emerald-400">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-emerald-700 dark:text-emerald-300">{watchedValues.fats || 0}g</div>
                    <div className="text-emerald-600 dark:text-emerald-400">Fats</div>
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
                  <span>Adding Meal...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Meal</span>
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

export default Nutrition;