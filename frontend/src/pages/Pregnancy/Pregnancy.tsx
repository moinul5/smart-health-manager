import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Baby, Calendar, Heart, BookOpen, CheckCircle, Clock, Apple, Activity } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { format, differenceInWeeks, addWeeks } from 'date-fns';
import toast from 'react-hot-toast';

const schema = yup.object({
  currentWeek: yup.number().min(1, 'Week must be between 1-42').max(42, 'Week must be between 1-42').required('Current week is required'),
  dueDate: yup.date().required('Due date is required'),
  lastCheckup: yup.date().required('Last checkup date is required'),
  nextCheckup: yup.date().required('Next checkup date is required'),
  notes: yup.string(),
});

interface PregnancyForm {
  currentWeek: number;
  dueDate: Date;
  lastCheckup: Date;
  nextCheckup: Date;
  notes: string;
}

const Pregnancy: React.FC = () => {
  const { user } = useAuth();
  const { pregnancyData, updatePregnancyData } = useHealth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PregnancyForm>({
    resolver: yupResolver(schema),
    defaultValues: pregnancyData ? {
      currentWeek: pregnancyData.currentWeek,
      dueDate: new Date(pregnancyData.dueDate),
      lastCheckup: new Date(pregnancyData.lastCheckup),
      nextCheckup: new Date(pregnancyData.nextCheckup),
      notes: pregnancyData.notes,
    } : undefined,
  });

  const onSubmit = (data: PregnancyForm) => {
    updatePregnancyData({
      ...data,
      userId: user!.id,
    });
    toast.success('Pregnancy data updated successfully!');
    reset();
    setIsModalOpen(false);
  };

  // Pregnancy timeline data
  const getPregnancyStage = (week: number) => {
    if (week <= 12) return { stage: 'First Trimester', color: 'bg-green-500', description: 'Early development phase' };
    if (week <= 27) return { stage: 'Second Trimester', color: 'bg-blue-500', description: 'Growth and development' };
    return { stage: 'Third Trimester', color: 'bg-purple-500', description: 'Final preparation' };
  };

  // Baby development milestones
  const getDevelopmentMilestone = (week: number) => {
    const milestones = {
      4: 'Heart begins to beat',
      8: 'All major organs formed',
      12: 'Fingerprints develop',
      16: 'Gender can be determined',
      20: 'Halfway point reached',
      24: 'Hearing develops',
      28: 'Eyes can open and close',
      32: 'Bones begin to harden',
      36: 'Lungs are nearly mature',
      40: 'Full term reached',
    };
    
    const milestoneWeeks = Object.keys(milestones).map(Number).sort((a, b) => a - b);
    const currentMilestone = milestoneWeeks.find(w => w >= week) || 40;
    return milestones[currentMilestone as keyof typeof milestones];
  };

  // Diet recommendations by trimester
  const getDietRecommendations = (week: number) => {
    if (week <= 12) {
      return [
        { nutrient: 'Folic Acid', amount: '400-800 mcg', foods: 'Leafy greens, citrus fruits, fortified cereals' },
        { nutrient: 'Iron', amount: '27 mg', foods: 'Lean meat, beans, spinach' },
        { nutrient: 'Calcium', amount: '1000 mg', foods: 'Dairy products, fortified plant milk' },
        { nutrient: 'Protein', amount: '71 g', foods: 'Fish, poultry, eggs, legumes' },
      ];
    } else if (week <= 27) {
      return [
        { nutrient: 'Protein', amount: '75 g', foods: 'Lean meat, fish, dairy, nuts' },
        { nutrient: 'Calcium', amount: '1000 mg', foods: 'Milk, cheese, yogurt, sardines' },
        { nutrient: 'Iron', amount: '27 mg', foods: 'Red meat, poultry, fish, dried fruits' },
        { nutrient: 'Omega-3', amount: '200-300 mg', foods: 'Salmon, walnuts, flaxseeds' },
      ];
    } else {
      return [
        { nutrient: 'Protein', amount: '75 g', foods: 'Fish, lean meat, dairy, legumes' },
        { nutrient: 'Calcium', amount: '1000 mg', foods: 'Dairy products, leafy greens' },
        { nutrient: 'Iron', amount: '27 mg', foods: 'Lean red meat, poultry, beans' },
        { nutrient: 'Fiber', amount: '25-30 g', foods: 'Whole grains, fruits, vegetables' },
      ];
    }
  };

  // Weekly tips
  const getWeeklyTips = (week: number) => {
    const tips = [
      'Stay hydrated by drinking plenty of water',
      'Take prenatal vitamins as recommended',
      'Get regular gentle exercise like walking',
      'Practice relaxation techniques',
      'Attend all scheduled prenatal appointments',
      'Avoid alcohol, smoking, and raw foods',
      'Get adequate sleep (7-9 hours)',
      'Monitor baby movements daily',
    ];
    
    return tips.slice(0, 4); // Return 4 random tips
  };

  const currentWeek = pregnancyData?.currentWeek || 0;
  const stage = getPregnancyStage(currentWeek);
  const milestone = getDevelopmentMilestone(currentWeek);
  const dietRecommendations = getDietRecommendations(currentWeek);
  const weeklyTips = getWeeklyTips(currentWeek);

  // Progress calculation
  const progressPercentage = Math.min((currentWeek / 40) * 100, 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pregnancy Care Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your pregnancy journey and get personalized care recommendations
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Baby className="h-4 w-4" />
            <span>{pregnancyData ? 'Update' : 'Setup'} Pregnancy Data</span>
          </Button>
        </div>
      </motion.div>

      {pregnancyData ? (
        <>
          {/* Pregnancy Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Baby className="h-10 w-10 text-pink-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Week {currentWeek}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{stage.stage}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Due Date</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {format(new Date(pregnancyData.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress</h3>
                  <p className="text-gray-600 dark:text-gray-400">{Math.round(progressPercentage)}% Complete</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pregnancy Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{currentWeek}/40 weeks</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${stage.color}`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Current Milestone & Checkups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Current Development
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Week {currentWeek} Milestone</p>
                    <p className="text-gray-600 dark:text-gray-400">{milestone}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Weekly Tips</h4>
                  {weeklyTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tip}</p>
                    </div>
                  ))}
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
                  Checkup Schedule
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Last Checkup</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(pregnancyData.lastCheckup), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Next Checkup</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(pregnancyData.nextCheckup), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {pregnancyData.notes && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{pregnancyData.notes}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Diet Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {stage.stage} Nutrition Recommendations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dietRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Apple className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-gray-900 dark:text-white">{rec.nutrient}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span className="font-medium">Daily Amount:</span> {rec.amount}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Sources:</span> {rec.foods}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Pregnancy Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pregnancy Timeline
              </h3>
              
              <div className="space-y-4">
                {[
                  { weeks: '1-12', title: 'First Trimester', description: 'Organ development, morning sickness common', completed: currentWeek > 12 },
                  { weeks: '13-27', title: 'Second Trimester', description: 'Energy returns, baby movements felt', completed: currentWeek > 27 },
                  { weeks: '28-40', title: 'Third Trimester', description: 'Rapid growth, preparation for birth', completed: currentWeek > 40 },
                ].map((phase, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      phase.completed 
                        ? 'bg-green-500 text-white' 
                        : currentWeek >= (index * 14 + 1) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {phase.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">{phase.title}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Weeks {phase.weeks}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center py-12">
            <Baby className="h-16 w-16 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to Pregnancy Care
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Set up your pregnancy data to get personalized care recommendations and track your journey.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 mx-auto"
            >
              <Baby className="h-4 w-4" />
              <span>Setup Pregnancy Tracking</span>
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Setup/Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={pregnancyData ? 'Update Pregnancy Data' : 'Setup Pregnancy Tracking'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current Week"
            type="number"
            min="1"
            max="42"
            {...register('currentWeek', { valueAsNumber: true })}
            error={errors.currentWeek?.message}
            placeholder="e.g., 20"
          />

          <Input
            label="Due Date"
            type="date"
            {...register('dueDate', { valueAsDate: true })}
            error={errors.dueDate?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Last Checkup"
              type="date"
              {...register('lastCheckup', { valueAsDate: true })}
              error={errors.lastCheckup?.message}
            />

            <Input
              label="Next Checkup"
              type="date"
              {...register('nextCheckup', { valueAsDate: true })}
              error={errors.nextCheckup?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
              placeholder="Any additional notes or concerns..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {pregnancyData ? 'Update' : 'Setup'} Pregnancy Data
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

export default Pregnancy;