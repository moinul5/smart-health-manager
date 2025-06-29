import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Brain, Plus, Smile, Frown, Meh, Heart, Zap } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import toast from 'react-hot-toast';

const schema = yup.object({
  mood: yup.string().oneOf(['excellent', 'good', 'neutral', 'bad', 'terrible']).required('Mood is required'),
  stressLevel: yup.number().min(1, 'Stress level must be between 1-10').max(10, 'Stress level must be between 1-10').required('Stress level is required'),
  journalText: yup.string().required('Journal entry is required'),
});

interface MoodForm {
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  stressLevel: number;
  journalText: string;
}

const MentalHealth: React.FC = () => {
  const { user } = useAuth();
  const { moods, addMood } = useHealth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MoodForm>({
    resolver: yupResolver(schema),
  });

  const watchedStressLevel = watch('stressLevel', 5);

  const onSubmit = (data: MoodForm) => {
    addMood({
      ...data,
      userId: user!.id,
      date: new Date(),
    });
    toast.success('Mood entry added successfully!');
    reset();
    setIsModalOpen(false);
  };

  // Mood icons and colors
  const moodConfig = {
    excellent: { icon: Smile, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900', label: 'Excellent' },
    good: { icon: Smile, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900', label: 'Good' },
    neutral: { icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900', label: 'Neutral' },
    bad: { icon: Frown, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900', label: 'Bad' },
    terrible: { icon: Frown, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900', label: 'Terrible' },
  };

  // Today's mood
  const todayMood = moods.find(mood => isToday(mood.date));

  // Weekly mood data
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
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

  // Mood distribution
  const moodDistribution = Object.keys(moodConfig).map(moodKey => {
    const moodType = moodKey as keyof typeof moodConfig;
    const count = moods.filter(mood => mood.mood === moodType).length;
    return {
      name: moodConfig[moodType].label,
      value: count,
      color: moodConfig[moodType].color.replace('text-', '#').replace('-500', '500'),
    };
  }).filter(item => item.value > 0);

  // Mindfulness activities based on mood/stress
  const getMindfulnessActivities = () => {
    if (!todayMood) return [];
    
    const { mood, stressLevel } = todayMood;
    
    if (stressLevel >= 7 || mood === 'bad' || mood === 'terrible') {
      return [
        { activity: 'Deep Breathing Exercise', duration: '5 minutes', icon: '🧘‍♀️' },
        { activity: 'Progressive Muscle Relaxation', duration: '10 minutes', icon: '💆‍♀️' },
        { activity: 'Mindful Walking', duration: '15 minutes', icon: '🚶‍♀️' },
        { activity: 'Guided Meditation', duration: '20 minutes', icon: '🎧' },
      ];
    } else if (stressLevel >= 4 || mood === 'neutral') {
      return [
        { activity: 'Gratitude Journaling', duration: '10 minutes', icon: '📝' },
        { activity: 'Mindful Stretching', duration: '15 minutes', icon: '🤸‍♀️' },
        { activity: 'Nature Sounds Meditation', duration: '10 minutes', icon: '🌲' },
        { activity: 'Positive Affirmations', duration: '5 minutes', icon: '💪' },
      ];
    } else {
      return [
        { activity: 'Creativity Time', duration: '30 minutes', icon: '🎨' },
        { activity: 'Social Connection', duration: '20 minutes', icon: '👥' },
        { activity: 'Physical Activity', duration: '30 minutes', icon: '🏃‍♀️' },
        { activity: 'Learning Something New', duration: '25 minutes', icon: '📚' },
      ];
    }
  };

  const suggestedActivities = getMindfulnessActivities();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mental Health Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monitor your mood and practice mindfulness for better mental well-being
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Mood Entry</span>
          </Button>
        </div>
      </motion.div>

      {/* Today's Mood */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Today's Mood
              </h3>
              {todayMood ? (
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${moodConfig[todayMood.mood].bg}`}>
                    {React.createElement(moodConfig[todayMood.mood].icon, {
                      className: `h-6 w-6 ${moodConfig[todayMood.mood].color}`,
                    })}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {moodConfig[todayMood.mood].label}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Stress Level: {todayMood.stressLevel}/10
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No mood entry for today. How are you feeling?
                </p>
              )}
            </div>
            {todayMood && (
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Journal Entry</p>
                <p className="text-gray-900 dark:text-white max-w-xs">
                  "{todayMood.journalText.substring(0, 100)}..."
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Mood & Stress Trends
            </h3>
            <div className="h-64">
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
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mood Distribution
            </h3>
            <div className="h-64">
              {moodDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    No mood data available yet
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Mindfulness Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Suggested Mindfulness Activities
          </h3>
          {suggestedActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {suggestedActivities.map((activity, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl mb-2">{activity.icon}</div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {activity.activity}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Add your first mood entry to get personalized activity suggestions!
            </p>
          )}
        </Card>
      </motion.div>

      {/* Recent Mood Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Mood Entries
          </h3>
          {moods.length > 0 ? (
            <div className="space-y-4">
              {moods.slice(0, 5).map((mood) => (
                <div key={mood.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`p-2 rounded-full ${moodConfig[mood.mood].bg} flex-shrink-0`}>
                    {React.createElement(moodConfig[mood.mood].icon, {
                      className: `h-5 w-5 ${moodConfig[mood.mood].color}`,
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {moodConfig[mood.mood].label}
                      </p>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span>{format(mood.date, 'MMM dd, yyyy')}</span>
                        <span className="ml-2">Stress: {mood.stressLevel}/10</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mood.journalText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No mood entries yet. Start tracking your mental health today!
            </p>
          )}
        </Card>
      </motion.div>

      {/* Add Mood Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Mood Entry"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(moodConfig).map(([moodKey, config]) => (
                <label key={moodKey} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    value={moodKey}
                    {...register('mood')}
                    className="sr-only"
                  />
                  <div className={`p-3 rounded-full border-2 transition-colors ${
                    watch('mood') === moodKey 
                      ? `${config.bg} border-emerald-500` 
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                    <config.icon className={`h-6 w-6 ${config.color}`} />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {config.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.mood && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.mood.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stress Level: {watchedStressLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              {...register('stressLevel', { valueAsNumber: true })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
            {errors.stressLevel && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stressLevel.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Journal Entry
            </label>
            <textarea
              {...register('journalText')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
              placeholder="How was your day? What made you feel this way?"
            />
            {errors.journalText && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.journalText.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Save Entry
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MentalHealth;