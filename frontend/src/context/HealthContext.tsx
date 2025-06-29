import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Meal, MoodEntry, Workout, Medication, EmergencyContact, PregnancyData } from '../types';
import { useAuth } from './AuthContext';

interface HealthState {
  meals: Meal[];
  moods: MoodEntry[];
  workouts: Workout[];
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  pregnancyData: PregnancyData | null;
  isLoading: boolean;
}

type HealthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_MEAL'; payload: Meal }
  | { type: 'ADD_MOOD'; payload: MoodEntry }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'ADD_MEDICATION'; payload: Medication }
  | { type: 'DELETE_MEDICATION'; payload: string }
  | { type: 'ADD_EMERGENCY_CONTACT'; payload: EmergencyContact }
  | { type: 'DELETE_EMERGENCY_CONTACT'; payload: string }
  | { type: 'UPDATE_PREGNANCY_DATA'; payload: PregnancyData }
  | { type: 'LOAD_DATA'; payload: Partial<HealthState> };

const initialState: HealthState = {
  meals: [],
  moods: [],
  workouts: [],
  medications: [],
  emergencyContacts: [],
  pregnancyData: null,
  isLoading: false,
};

const healthReducer = (state: HealthState, action: HealthAction): HealthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_MEAL':
      return { ...state, meals: [action.payload, ...state.meals] };
    case 'ADD_MOOD':
      return { ...state, moods: [action.payload, ...state.moods] };
    case 'ADD_WORKOUT':
      return { ...state, workouts: [action.payload, ...state.workouts] };
    case 'ADD_MEDICATION':
      return { ...state, medications: [action.payload, ...state.medications] };
    case 'DELETE_MEDICATION':
      return { 
        ...state, 
        medications: state.medications.filter(med => med.id !== action.payload) 
      };
    case 'ADD_EMERGENCY_CONTACT':
      return { ...state, emergencyContacts: [action.payload, ...state.emergencyContacts] };
    case 'DELETE_EMERGENCY_CONTACT':
      return { 
        ...state, 
        emergencyContacts: state.emergencyContacts.filter(contact => contact.id !== action.payload) 
      };
    case 'UPDATE_PREGNANCY_DATA':
      return { ...state, pregnancyData: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload, isLoading: false };
    default:
      return state;
  }
};

interface HealthContextType extends HealthState {
  addMeal: (meal: Omit<Meal, 'id'>) => Promise<void>;
  addMood: (mood: Omit<MoodEntry, 'id'>) => Promise<void>;
  addWorkout: (workout: Omit<Workout, 'id'>) => Promise<void>;
  addMedication: (medication: Omit<Medication, 'id'>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  deleteEmergencyContact: (id: string) => Promise<void>;
  updatePregnancyData: (data: Omit<PregnancyData, 'id'>) => Promise<void>;
  loadUserData: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

interface HealthProviderProps {
  children: ReactNode;
}

// API Base URL - Using direct PHP files to bypass .htaccess issues
const API_BASE_URL = 'http://localhost/backend/api';

export const HealthProvider: React.FC<HealthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(healthReducer, initialState);
  const { user } = useAuth();

  // Enhanced API call function with multiple endpoint fallbacks
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    console.log('🌐 API Call to:', endpoint);
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...options.headers,
      },
      cache: 'no-cache',
      ...options,
    };

    console.log('📤 Request options:', defaultOptions);

    try {
      const response = await fetch(endpoint, defaultOptions);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ API Call error:', error);
      throw error;
    }
  };

  // Enhanced data loading with multiple endpoint attempts
  const loadUserData = async () => {
    if (!user) {
      console.log('⚠️ No user found, skipping data load');
      return;
    }

    console.log('🔄 Loading user data for user ID:', user.id);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Define endpoint pairs (direct access first, then rewrite URL)
      const endpointPairs = {
        meals: [
          `${API_BASE_URL}/meals/direct.php?user_id=${user.id}`,
          `${API_BASE_URL}/meals?user_id=${user.id}`
        ],
        moods: [
          `${API_BASE_URL}/moods/direct.php?user_id=${user.id}`,
          `${API_BASE_URL}/moods?user_id=${user.id}`
        ],
        workouts: [
          `${API_BASE_URL}/workouts/direct.php?user_id=${user.id}`,
          `${API_BASE_URL}/workouts?user_id=${user.id}`
        ],
        medications: [
          `${API_BASE_URL}/medications/direct.php?user_id=${user.id}`,
          `${API_BASE_URL}/medications?user_id=${user.id}`
        ],
        emergency: [
          `${API_BASE_URL}/emergency/direct.php?user_id=${user.id}`,
          `${API_BASE_URL}/emergency?user_id=${user.id}`
        ],
        pregnancy: [
          `${API_BASE_URL}/pregnancy/direct.php?user_id=${user.id}`,
          `${API_BASE_URL}/pregnancy?user_id=${user.id}`
        ]
      };

      // Function to try multiple endpoints
      const tryEndpoints = async (endpoints: string[], dataType: string) => {
        for (const endpoint of endpoints) {
          try {
            console.log(`📊 Trying ${dataType} endpoint:`, endpoint);
            const data = await apiCall(endpoint);
            console.log(`✅ ${dataType} data loaded successfully:`, data);
            return data;
          } catch (error) {
            console.log(`❌ Failed ${dataType} endpoint:`, endpoint, error);
            continue;
          }
        }
        console.warn(`⚠️ All ${dataType} endpoints failed, returning empty array`);
        return [];
      };

      // Load all data types with enhanced error handling
      console.log('📊 Loading meals...');
      const mealsData = await tryEndpoints(endpointPairs.meals, 'meals');
      
      console.log('🧠 Loading moods...');
      const moodsData = await tryEndpoints(endpointPairs.moods, 'moods');
      
      console.log('💪 Loading workouts...');
      const workoutsData = await tryEndpoints(endpointPairs.workouts, 'workouts');
      
      console.log('💊 Loading medications...');
      const medicationsData = await tryEndpoints(endpointPairs.medications, 'medications');
      
      console.log('🚨 Loading emergency contacts...');
      const emergencyData = await tryEndpoints(endpointPairs.emergency, 'emergency');
      
      // Load pregnancy data (optional)
      console.log('👶 Loading pregnancy data...');
      let pregnancyData = null;
      try {
        pregnancyData = await tryEndpoints(endpointPairs.pregnancy, 'pregnancy');
        // If we get an empty array, set to null
        if (Array.isArray(pregnancyData) && pregnancyData.length === 0) {
          pregnancyData = null;
        }
      } catch (error) {
        console.log('ℹ️ No pregnancy data found (this is normal)');
        pregnancyData = null;
      }

      // Transform data to match frontend format with enhanced field mapping
      const transformedData = {
        meals: Array.isArray(mealsData) ? mealsData.map((meal: any) => ({
          id: meal.id?.toString() || Date.now().toString(),
          userId: meal.userId || meal.user_id || user.id,
          foodItem: meal.foodItem || meal.food_item,
          calories: parseInt(meal.calories) || 0,
          protein: parseFloat(meal.protein) || 0,
          carbs: parseFloat(meal.carbs) || 0,
          fats: parseFloat(meal.fats) || 0,
          mealType: meal.mealType || meal.meal_type,
          date: new Date(meal.date),
        })) : [],
        moods: Array.isArray(moodsData) ? moodsData.map((mood: any) => ({
          id: mood.id?.toString() || Date.now().toString(),
          userId: mood.userId || mood.user_id || user.id,
          mood: mood.mood,
          stressLevel: parseInt(mood.stressLevel || mood.stress_level) || 5,
          journalText: mood.journalText || mood.journal_text || '',
          date: new Date(mood.date),
        })) : [],
        workouts: Array.isArray(workoutsData) ? workoutsData.map((workout: any) => ({
          id: workout.id?.toString() || Date.now().toString(),
          userId: workout.userId || workout.user_id || user.id,
          exerciseType: workout.exerciseType || workout.exercise_type,
          duration: parseInt(workout.duration) || 0,
          caloriesBurned: parseInt(workout.caloriesBurned || workout.calories_burned) || 0,
          goal: workout.goal || '',
          date: new Date(workout.date),
        })) : [],
        medications: Array.isArray(medicationsData) ? medicationsData.map((med: any) => ({
          id: med.id?.toString() || Date.now().toString(),
          userId: med.userId || med.user_id || user.id,
          medicineName: med.medicineName || med.medicine_name,
          dosage: med.dosage || '',
          frequency: med.frequency || '',
          startDate: new Date(med.startDate || med.start_date),
          endDate: new Date(med.endDate || med.end_date),
          reminderTimes: Array.isArray(med.reminderTimes) ? med.reminderTimes : 
                        (Array.isArray(med.reminder_times) ? med.reminder_times : 
                        (typeof med.reminderTimes === 'string' ? JSON.parse(med.reminderTimes) : 
                        (typeof med.reminder_times === 'string' ? JSON.parse(med.reminder_times) : []))),
        })) : [],
        emergencyContacts: Array.isArray(emergencyData) ? emergencyData.map((contact: any) => ({
          id: contact.id?.toString() || Date.now().toString(),
          userId: contact.userId || contact.user_id || user.id,
          name: contact.name || '',
          relation: contact.relation || '',
          phone: contact.phone || '',
          location: contact.location || '',
        })) : [],
        pregnancyData: pregnancyData && !Array.isArray(pregnancyData) ? {
          id: pregnancyData.id?.toString() || Date.now().toString(),
          userId: pregnancyData.userId || pregnancyData.user_id || user.id,
          currentWeek: parseInt(pregnancyData.currentWeek || pregnancyData.current_week) || 0,
          dueDate: new Date(pregnancyData.dueDate || pregnancyData.due_date),
          lastCheckup: new Date(pregnancyData.lastCheckup || pregnancyData.last_checkup),
          nextCheckup: new Date(pregnancyData.nextCheckup || pregnancyData.next_checkup),
          notes: pregnancyData.notes || '',
        } : null,
      };

      console.log('✅ All data transformed successfully:', transformedData);
      
      // Count loaded items for user feedback
      const totalItems = transformedData.meals.length + 
                        transformedData.moods.length + 
                        transformedData.workouts.length + 
                        transformedData.medications.length + 
                        transformedData.emergencyContacts.length;
      
      console.log(`📈 Loaded ${totalItems} total health records for user ${user.name}`);
      console.log(`📊 Data breakdown: ${transformedData.meals.length} meals, ${transformedData.moods.length} moods, ${transformedData.workouts.length} workouts, ${transformedData.medications.length} medications, ${transformedData.emergencyContacts.length} emergency contacts`);
      
      dispatch({ type: 'LOAD_DATA', payload: transformedData });
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      // Don't throw the error, just log it so the app doesn't crash
    }
  };

  // Load data when user changes
  React.useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const addMeal = async (meal: Omit<Meal, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const mealData = {
        user_id: user.id,
        foodItem: meal.foodItem,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        mealType: meal.mealType,
        date: meal.date ? meal.date.toISOString() : new Date().toISOString(),
      };

      console.log('🍽️ Adding meal with data:', mealData);

      // Try direct access first, then fallback
      try {
        await apiCall(`${API_BASE_URL}/meals/direct.php`, {
          method: 'POST',
          body: JSON.stringify(mealData),
        });
      } catch (error) {
        await apiCall(`${API_BASE_URL}/meals`, {
          method: 'POST',
          body: JSON.stringify(mealData),
        });
      }

      const newMeal: Meal = { 
        ...meal, 
        id: Date.now().toString(),
        userId: user.id,
      };
      dispatch({ type: 'ADD_MEAL', payload: newMeal });
    } catch (error) {
      throw error;
    }
  };

  const addMood = async (mood: Omit<MoodEntry, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const moodData = {
        user_id: user.id,
        mood: mood.mood,
        stressLevel: mood.stressLevel,
        journalText: mood.journalText,
        date: mood.date ? mood.date.toISOString() : new Date().toISOString(),
      };

      console.log('🧠 Adding mood with data:', moodData);

      try {
        await apiCall(`${API_BASE_URL}/moods/direct.php`, {
          method: 'POST',
          body: JSON.stringify(moodData),
        });
      } catch (error) {
        await apiCall(`${API_BASE_URL}/moods`, {
          method: 'POST',
          body: JSON.stringify(moodData),
        });
      }

      const newMood: MoodEntry = { 
        ...mood, 
        id: Date.now().toString(),
        userId: user.id,
      };
      dispatch({ type: 'ADD_MOOD', payload: newMood });
    } catch (error) {
      throw error;
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const workoutData = {
        user_id: user.id,
        exerciseType: workout.exerciseType,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned,
        goal: workout.goal,
        date: workout.date ? workout.date.toISOString() : new Date().toISOString(),
      };

      console.log('💪 Adding workout with data:', workoutData);

      try {
        await apiCall(`${API_BASE_URL}/workouts/direct.php`, {
          method: 'POST',
          body: JSON.stringify(workoutData),
        });
      } catch (error) {
        await apiCall(`${API_BASE_URL}/workouts`, {
          method: 'POST',
          body: JSON.stringify(workoutData),
        });
      }

      const newWorkout: Workout = { 
        ...workout, 
        id: Date.now().toString(),
        userId: user.id,
      };
      dispatch({ type: 'ADD_WORKOUT', payload: newWorkout });
    } catch (error) {
      throw error;
    }
  };

  const addMedication = async (medication: Omit<Medication, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const medicationData = {
        user_id: user.id,
        medicineName: medication.medicineName,
        dosage: medication.dosage,
        frequency: medication.frequency,
        startDate: medication.startDate.toISOString().split('T')[0],
        endDate: medication.endDate.toISOString().split('T')[0],
        reminderTimes: medication.reminderTimes,
      };

      console.log('💊 Adding medication with data:', medicationData);

      try {
        await apiCall(`${API_BASE_URL}/medications/direct.php`, {
          method: 'POST',
          body: JSON.stringify(medicationData),
        });
      } catch (error) {
        await apiCall(`${API_BASE_URL}/medications`, {
          method: 'POST',
          body: JSON.stringify(medicationData),
        });
      }

      const newMedication: Medication = { 
        ...medication, 
        id: Date.now().toString(),
        userId: user.id,
      };
      dispatch({ type: 'ADD_MEDICATION', payload: newMedication });
    } catch (error) {
      throw error;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      try {
        await apiCall(`${API_BASE_URL}/medications/direct.php?id=${id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        await apiCall(`${API_BASE_URL}/medications?id=${id}`, {
          method: 'DELETE',
        });
      }

      dispatch({ type: 'DELETE_MEDICATION', payload: id });
    } catch (error) {
      throw error;
    }
  };

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const contactData = {
        user_id: user.id,
        name: contact.name,
        relation: contact.relation,
        phone: contact.phone,
        location: contact.location,
      };

      console.log('🚨 Adding emergency contact with data:', contactData);

      try {
        await apiCall(`${API_BASE_URL}/emergency/direct.php`, {
          method: 'POST',
          body: JSON.stringify(contactData),
        });
      } catch (error) {
        await apiCall(`${API_BASE_URL}/emergency`, {
          method: 'POST',
          body: JSON.stringify(contactData),
        });
      }

      const newContact: EmergencyContact = { 
        ...contact, 
        id: Date.now().toString(),
        userId: user.id,
      };
      dispatch({ type: 'ADD_EMERGENCY_CONTACT', payload: newContact });
    } catch (error) {
      throw error;
    }
  };

  const deleteEmergencyContact = async (id: string) => {
    try {
      try {
        await apiCall(`${API_BASE_URL}/emergency/direct.php?id=${id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        await apiCall(`${API_BASE_URL}/emergency?id=${id}`, {
          method: 'DELETE',
        });
      }

      dispatch({ type: 'DELETE_EMERGENCY_CONTACT', payload: id });
    } catch (error) {
      throw error;
    }
  };

  const updatePregnancyData = async (data: Omit<PregnancyData, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const pregnancyData = {
        user_id: user.id,
        currentWeek: data.currentWeek,
        dueDate: data.dueDate.toISOString().split('T')[0],
        lastCheckup: data.lastCheckup.toISOString().split('T')[0],
        nextCheckup: data.nextCheckup.toISOString().split('T')[0],
        notes: data.notes,
      };

      console.log('👶 Adding/updating pregnancy data:', pregnancyData);

      const method = state.pregnancyData ? 'PUT' : 'POST';
      
      try {
        await apiCall(`${API_BASE_URL}/pregnancy/direct.php`, {
          method,
          body: JSON.stringify(pregnancyData),
        });
      } catch (error) {
        await apiCall(`${API_BASE_URL}/pregnancy`, {
          method,
          body: JSON.stringify(pregnancyData),
        });
      }

      const pregnancyDataWithId: PregnancyData = { 
        ...data, 
        id: Date.now().toString(),
        userId: user.id,
      };
      dispatch({ type: 'UPDATE_PREGNANCY_DATA', payload: pregnancyDataWithId });
    } catch (error) {
      throw error;
    }
  };

  const value: HealthContextType = {
    ...state,
    addMeal,
    addMood,
    addWorkout,
    addMedication,
    deleteMedication,
    addEmergencyContact,
    deleteEmergencyContact,
    updatePregnancyData,
    loadUserData,
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};