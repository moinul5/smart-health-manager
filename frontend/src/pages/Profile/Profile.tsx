import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Heart, Target, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120').required('Age is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  height: yup.number().min(50, 'Height must be at least 50cm').max(300, 'Height must be less than 300cm').required('Height is required'),
  weight: yup.number().min(20, 'Weight must be at least 20kg').max(300, 'Weight must be less than 300kg').required('Weight is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  emergencyContact: yup.string().required('Emergency contact is required'),
  medicalHistory: yup.string(),
  fitnessGoals: yup.string(),
});

interface ProfileForm {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  phone: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
  fitnessGoals: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      age: user?.age || 0,
      gender: user?.gender || 'other',
      height: user?.height || 0,
      weight: user?.weight || 0,
      phone: user?.contactInfo?.phone || '',
      address: user?.contactInfo?.address || '',
      emergencyContact: user?.contactInfo?.emergencyContact || '',
      medicalHistory: user?.medicalHistory?.join(', ') || '',
      fitnessGoals: user?.fitnessGoals?.join(', ') || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile({
        name: data.name,
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        contactInfo: {
          phone: data.phone,
          address: data.address,
          emergencyContact: data.emergencyContact,
        },
        medicalHistory: data.medicalHistory.split(',').map(item => item.trim()).filter(Boolean),
        fitnessGoals: data.fitnessGoals.split(',').map(item => item.trim()).filter(Boolean),
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const calculateBMI = () => {
    if (user?.height && user?.weight) {
      const heightInMeters = user.height / 100;
      return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return 'N/A';
  };

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmiValue < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmiValue < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your personal information and health data
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'secondary' : 'primary'}
            className="flex items-center space-x-2"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card>
            <div className="text-center">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Age</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.age} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Height</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.height} cm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Weight</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.weight} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">BMI</span>
                  <div className="text-right">
                    <span className="font-medium text-gray-900 dark:text-white">{bmi}</span>
                    <p className={`text-xs ${bmiInfo.color}`}>{bmiInfo.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Health Summary */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Health Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.medicalHistory?.length || 0} Medical Conditions
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.fitnessGoals?.length || 0} Fitness Goals
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  icon={<User className="h-5 w-5 text-gray-400" />}
                  disabled={!isEditing}
                  {...register('name')}
                  error={errors.name?.message}
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={user?.email}
                  disabled
                  icon={<Mail className="h-5 w-5 text-gray-400" />}
                />

                <Input
                  label="Age"
                  type="number"
                  disabled={!isEditing}
                  {...register('age', { valueAsNumber: true })}
                  error={errors.age?.message}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gender.message}</p>
                  )}
                </div>

                <Input
                  label="Height (cm)"
                  type="number"
                  disabled={!isEditing}
                  {...register('height', { valueAsNumber: true })}
                  error={errors.height?.message}
                />

                <Input
                  label="Weight (kg)"
                  type="number"
                  disabled={!isEditing}
                  {...register('weight', { valueAsNumber: true })}
                  error={errors.weight?.message}
                />

                <Input
                  label="Phone Number"
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                  disabled={!isEditing}
                  {...register('phone')}
                  error={errors.phone?.message}
                />

                <Input
                  label="Address"
                  icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  disabled={!isEditing}
                  {...register('address')}
                  error={errors.address?.message}
                />
              </div>

              <Input
                label="Emergency Contact"
                disabled={!isEditing}
                {...register('emergencyContact')}
                error={errors.emergencyContact?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medical History (comma-separated)
                </label>
                <textarea
                  {...register('medicalHistory')}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed resize-none"
                  placeholder="e.g., Hypertension, Diabetes, Allergies"
                />
                {errors.medicalHistory && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.medicalHistory.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fitness Goals (comma-separated)
                </label>
                <textarea
                  {...register('fitnessGoals')}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed resize-none"
                  placeholder="e.g., Weight Loss, Muscle Building, Endurance"
                />
                {errors.fitnessGoals && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fitnessGoals.message}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-4">
                  <Button type="submit" className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;