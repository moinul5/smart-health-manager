import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Phone, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

// Basic registration schema - only essential fields required
const basicSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

// Complete profile schema - all fields
const completeSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  age: yup.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120').required('Age is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  height: yup.number().min(50, 'Height must be at least 50cm').max(300, 'Height must be less than 300cm').required('Height is required'),
  weight: yup.number().min(20, 'Weight must be at least 20kg').max(300, 'Weight must be less than 300kg').required('Weight is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
});



interface BasicForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface CompleteForm extends BasicForm {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  phone: string;
  address: string;
}

const Register: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'basic' | 'complete'>('basic');
  const [basicData, setBasicData] = useState<BasicForm | null>(null);

  // Basic form for step 1
  const basicForm = useForm<BasicForm>({
    resolver: yupResolver(basicSchema),
  });

  // Complete form for step 2
  const completeForm = useForm<CompleteForm>({
    resolver: yupResolver(completeSchema),
  });

  const onBasicSubmit = (data: BasicForm) => {
    setBasicData(data);
    setStep('complete');
    // Pre-fill the complete form with basic data and defaults
    completeForm.reset({
      ...data,
      age: 25,
      gender: 'other',
      height: 170,
      weight: 70,
      phone: '',
      address: '',
    });
  };

  const onCompleteSubmit = async (data: CompleteForm) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        contactInfo: {
          phone: data.phone,
          address: data.address,
          emergencyContact: '',
        },
        medicalHistory: [],
        fitnessGoals: [],
        pregnancyStatus: false,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    }
  };

  const handleQuickRegister = async () => {
    if (!basicData) return;
    
    try {
      await registerUser({
        name: basicData.name,
        email: basicData.email,
        password: basicData.password,
        age: 25, // Default values
        gender: 'other',
        height: 170,
        weight: 70,
        contactInfo: {
          phone: '',
          address: '',
          emergencyContact: '',
        },
        medicalHistory: [],
        fitnessGoals: [],
        pregnancyStatus: false,
      });
      toast.success('Account created successfully! You can complete your profile later.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    }
  };

  const handleBackToBasic = () => {
    setStep('basic');
    setBasicData(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <Heart className="h-16 w-16 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {step === 'basic' ? 'Create Your Account' : 'Complete Your Profile'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {step === 'basic' 
              ? 'Join HealthCare+ and start your wellness journey'
              : 'Help us personalize your health experience'
            }
          </p>
          
          {/* Progress indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${step === 'basic' ? 'bg-emerald-600' : 'bg-emerald-300'}`} />
            <div className={`w-8 h-1 ${step === 'complete' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 'complete' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          {step === 'basic' ? (
            <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                icon={<User className="h-5 w-5 text-gray-400" />}
                {...basicForm.register('name')}
                error={basicForm.formState.errors.name?.message}
                placeholder="Enter your full name"
              />

              <Input
                label="Email Address"
                type="email"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                {...basicForm.register('email')}
                error={basicForm.formState.errors.email?.message}
                placeholder="Enter your email address"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Password"
                  type="password"
                  icon={<Lock className="h-5 w-5 text-gray-400" />}
                  {...basicForm.register('password')}
                  error={basicForm.formState.errors.password?.message}
                  placeholder="Create a password"
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  icon={<Lock className="h-5 w-5 text-gray-400" />}
                  {...basicForm.register('confirmPassword')}
                  error={basicForm.formState.errors.confirmPassword?.message}
                  placeholder="Confirm your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={completeForm.handleSubmit(onCompleteSubmit)} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This information helps us provide personalized health recommendations
                </p>
              </div>

              {/* Hidden fields to maintain basic data */}
              <input type="hidden" {...completeForm.register('name')} />
              <input type="hidden" {...completeForm.register('email')} />
              <input type="hidden" {...completeForm.register('password')} />
              <input type="hidden" {...completeForm.register('confirmPassword')} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Age"
                  type="number"
                  {...completeForm.register('age', { valueAsNumber: true })}
                  error={completeForm.formState.errors.age?.message}
                  placeholder="Enter your age"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    {...completeForm.register('gender')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {completeForm.formState.errors.gender && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{completeForm.formState.errors.gender.message}</p>
                  )}
                </div>

                <Input
                  label="Height (cm)"
                  type="number"
                  {...completeForm.register('height', { valueAsNumber: true })}
                  error={completeForm.formState.errors.height?.message}
                  placeholder="Enter your height"
                />

                <Input
                  label="Weight (kg)"
                  type="number"
                  {...completeForm.register('weight', { valueAsNumber: true })}
                  error={completeForm.formState.errors.weight?.message}
                  placeholder="Enter your weight"
                />

                <Input
                  label="Phone Number"
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                  {...completeForm.register('phone')}
                  error={completeForm.formState.errors.phone?.message}
                  placeholder="Enter your phone number"
                />

                <Input
                  label="Address"
                  icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  {...completeForm.register('address')}
                  error={completeForm.formState.errors.address?.message}
                  placeholder="Enter your address"
                />
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                >
                  Complete Registration
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleQuickRegister}
                  className="w-full"
                  loading={isLoading}
                >
                  Skip for Now (Complete Later)
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBackToBasic}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;