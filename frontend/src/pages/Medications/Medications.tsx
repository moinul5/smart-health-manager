import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Pill, Plus, Clock, Calendar, Trash2, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { format, addDays, isBefore, isToday } from 'date-fns';
import toast from 'react-hot-toast';

const schema = yup.object({
  medicineName: yup.string().required('Medicine name is required'),
  dosage: yup.string().required('Dosage is required'),
  frequency: yup.string().required('Frequency is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().min(yup.ref('startDate'), 'End date must be after start date').required('End date is required'),
  reminderTimes: yup.string().required('At least one reminder time is required'),
});

interface MedicationForm {
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate: Date;
  reminderTimes: string;
}

const Medications: React.FC = () => {
  const { user } = useAuth();
  const { medications, addMedication, deleteMedication } = useHealth();
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
  } = useForm<MedicationForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      medicineName: '',
      dosage: '',
      frequency: '',
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      reminderTimes: '',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: MedicationForm) => {
    setIsSubmitting(true);
    try {
      console.log('💊 Submitting medication data:', data);
      
      // Show loading toast
      const loadingToast = toast.loading('Adding medication...');
      
      const reminderTimesArray = data.reminderTimes.split(',').map(time => time.trim()).filter(Boolean);
      
      await addMedication({
        ...data,
        userId: user!.id,
        reminderTimes: reminderTimesArray,
      });
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Medication added successfully!</span>
        </div>,
        { duration: 3000 }
      );
      
      reset();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('❌ Error adding medication:', error);
      toast.error(
        <div>
          <div className="font-medium">Failed to add medication</div>
          <div className="text-sm text-gray-600">{error.message || 'Please try again'}</div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMedication = (id: string, medicineName: string) => {
    if (window.confirm(`Are you sure you want to delete ${medicineName}?`)) {
      deleteMedication(id);
      toast.success('Medication deleted successfully!');
    }
  };

  // Quick medication presets for better UX
  const quickMedications = [
    { name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', times: '09:00' },
    { name: 'Multivitamin', dosage: '1 tablet', frequency: 'Once daily', times: '08:00' },
    { name: 'Omega-3', dosage: '1000mg', frequency: 'Twice daily', times: '08:00, 20:00' },
    { name: 'Calcium', dosage: '500mg', frequency: 'Twice daily', times: '09:00, 21:00' },
    { name: 'Iron Supplement', dosage: '65mg', frequency: 'Once daily', times: '12:00' },
    { name: 'Probiotics', dosage: '1 capsule', frequency: 'Once daily', times: '08:00' },
  ];

  const fillQuickMedication = (med: any) => {
    setValue('medicineName', med.name, { shouldValidate: true });
    setValue('dosage', med.dosage, { shouldValidate: true });
    setValue('frequency', med.frequency, { shouldValidate: true });
    setValue('reminderTimes', med.times, { shouldValidate: true });
    clearErrors();
    toast.success(`Quick medication "${med.name}" loaded!`);
  };

  // Get active medications
  const activeMedications = medications.filter(med => 
    !isBefore(new Date(med.endDate), new Date())
  );

  // Get today's medications
  const todayMedications = activeMedications.filter(med => 
    !isBefore(new Date(med.endDate), new Date()) && 
    !isBefore(new Date(), new Date(med.startDate))
  );

  // Get upcoming reminders for today
  const getUpcomingReminders = () => {
    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    
    return todayMedications.flatMap(med => 
      med.reminderTimes
        .filter(time => time > currentTime)
        .map(time => ({
          ...med,
          reminderTime: time,
        }))
    ).sort((a, b) => a.reminderTime.localeCompare(b.reminderTime));
  };

  const upcomingReminders = getUpcomingReminders();

  // Medication status
  const getMedicationStatus = (medication: any) => {
    const now = new Date();
    const startDate = new Date(medication.startDate);
    const endDate = new Date(medication.endDate);
    
    if (isBefore(now, startDate)) {
      return { status: 'upcoming', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' };
    } else if (isBefore(endDate, now)) {
      return { status: 'completed', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900' };
    } else {
      return { status: 'active', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' };
    }
  };

  const frequencyOptions = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours',
    'As needed', 'Weekly', 'Monthly'
  ];

  // Reset form and set defaults when modal opens
  const handleModalOpen = () => {
    setIsModalOpen(true);
    reset({
      medicineName: '',
      dosage: '',
      frequency: '',
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      reminderTimes: '',
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medication Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your medications and never miss a dose
            </p>
          </div>
          <Button
            onClick={handleModalOpen}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medication</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Medications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeMedications.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Currently taking
                </p>
              </div>
              <Pill className="h-8 w-8 text-emerald-500" />
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Doses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {todayMedications.reduce((sum, med) => sum + med.reminderTimes.length, 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Scheduled for today
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Reminders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingReminders.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Remaining today
                </p>
              </div>
              <Bell className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Upcoming Reminders
            </h3>
            <div className="space-y-3">
              {upcomingReminders.map((reminder, index) => (
                <div key={`${reminder.id}-${index}`} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{reminder.medicineName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.dosage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-orange-600">{reminder.reminderTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Medications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Medications
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Pill className="h-4 w-4" />
              <span>{medications.length} total medications</span>
            </div>
          </div>
          
          {medications.length > 0 ? (
            <div className="space-y-4">
              {medications.map((medication) => {
                const status = getMedicationStatus(medication);
                return (
                  <motion.div 
                    key={medication.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {medication.medicineName}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            {status.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <span className="font-medium">Dosage:</span> {medication.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span> {medication.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Start:</span> {format(new Date(medication.startDate), 'MMM dd, yyyy')}
                          </div>
                          <div>
                            <span className="font-medium">End:</span> {format(new Date(medication.endDate), 'MMM dd, yyyy')}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Reminder Times:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {medication.reminderTimes.map((time, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteMedication(medication.id, medication.medicineName)}
                        className="ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No medications added yet</p>
              <p className="text-gray-400 dark:text-gray-500 mb-6">Start managing your medications by adding your first one!</p>
              <Button
                onClick={handleModalOpen}
                className="flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Medication</span>
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Enhanced Add Medication Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Add New Medication"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quick Medication Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Medication Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickMedications.map((med, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillQuickMedication(med)}
                  disabled={isSubmitting}
                  className="text-left p-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{med.name}</div>
                  <div className="text-gray-600 dark:text-gray-400">{med.dosage} • {med.frequency}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <Input
              label="Medicine Name"
              {...register('medicineName')}
              error={errors.medicineName?.message}
              placeholder="e.g., Aspirin, Vitamin D"
              disabled={isSubmitting}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Dosage"
                {...register('dosage')}
                error={errors.dosage?.message}
                placeholder="e.g., 100mg, 1 tablet"
                disabled={isSubmitting}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frequency
                </label>
                <select
                  {...register('frequency')}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) => {
                    e.preventDefault();
                    setValue('frequency', e.target.value, { shouldValidate: true });
                  }}
                >
                  <option value="">Select frequency</option>
                  {frequencyOptions.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
                {errors.frequency && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.frequency.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Start Date"
                type="date"
                {...register('startDate', { valueAsDate: true })}
                error={errors.startDate?.message}
                disabled={isSubmitting}
              />

              <Input
                label="End Date"
                type="date"
                {...register('endDate', { valueAsDate: true })}
                error={errors.endDate?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reminder Times (comma-separated)
              </label>
              <input
                type="text"
                {...register('reminderTimes')}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., 08:00, 14:00, 20:00"
              />
              {errors.reminderTimes && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reminderTimes.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter times in 24-hour format (HH:MM), separated by commas
              </p>
            </div>

            {/* Medication Preview */}
            {(watchedValues.medicineName || watchedValues.dosage || watchedValues.frequency) && (
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                  Medication Preview
                </h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-purple-600 dark:text-purple-400">Medicine:</span>
                    <span className="font-medium text-purple-700 dark:text-purple-300">{watchedValues.medicineName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600 dark:text-purple-400">Dosage:</span>
                    <span className="font-medium text-purple-700 dark:text-purple-300">{watchedValues.dosage || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600 dark:text-purple-400">Frequency:</span>
                    <span className="font-medium text-purple-700 dark:text-purple-300">{watchedValues.frequency || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600 dark:text-purple-400">Reminders:</span>
                    <span className="font-medium text-purple-700 dark:text-purple-300">
                      {watchedValues.reminderTimes ? watchedValues.reminderTimes.split(',').length : 0} times
                    </span>
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
                  <span>Adding Medication...</span>
                </>
              ) : (
                <>
                  <Pill className="h-4 w-4" />
                  <span>Add Medication</span>
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

export default Medications;