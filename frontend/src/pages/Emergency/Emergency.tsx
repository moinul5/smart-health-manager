import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Phone, Plus, MapPin, Users, AlertTriangle, Guitar as Hospital, Pill as PharmacyIcon, Stethoscope, Trash2, Navigation, CheckCircle } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { Hospital as HospitalType } from '../../types';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  relation: yup.string().required('Relation is required'),
  phone: yup.string().required('Phone number is required'),
  location: yup.string().required('Location is required'),
});

interface ContactForm {
  name: string;
  relation: string;
  phone: string;
  location: string;
}

const Emergency: React.FC = () => {
  const { user } = useAuth();
  const { emergencyContacts, addEmergencyContact, deleteEmergencyContact } = useHealth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm<ContactForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      relation: '',
      phone: '',
      location: '',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      console.log('🚨 Submitting emergency contact data:', data);
      
      // Show loading toast
      const loadingToast = toast.loading('Adding emergency contact...');
      
      await addEmergencyContact({
        ...data,
        userId: user!.id,
      });
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Emergency contact added successfully!</span>
        </div>,
        { duration: 3000 }
      );
      
      reset();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('❌ Error adding emergency contact:', error);
      toast.error(
        <div>
          <div className="font-medium">Failed to add emergency contact</div>
          <div className="text-sm text-gray-600">{error.message || 'Please try again'}</div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteEmergencyContact(id);
      toast.success('Emergency contact deleted successfully!');
    }
  };

  const handleSOSClick = () => {
    setIsSOSActive(true);
    toast.success('SOS Alert Activated! Emergency contacts have been notified.');
    
    // Simulate vibration if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Reset SOS state after 5 seconds
    setTimeout(() => {
      setIsSOSActive(false);
    }, 5000);
  };

 

  // Mock nearby hospitals and pharmacies
  const nearbyFacilities: HospitalType[] = [
    {
      id: '1',
      name: 'Square Hospital',
      address: '18 Bir Uttam Qazi Nuruzzaman Road, Dhaka',
      phone: '09610-010616',
      distance: 8.6,
      type: 'hospital',
    },
    {
      id: '2',
      name: 'Modern Cure General Hospital Ltd.',
      address: 'Maulana Bhawan, Road 1, Dhaka',
      phone: '01974-528035',
      distance: 1.2,
      type: 'clinic',
    },
    {
      id: '3',
      name: 'Doctors General Hospital',
      address: '31-32 Dhaka - Mawa Hwyy, Dhaka',
      phone: '01755-618910',
      distance: 0.5,
      type: 'pharmacy',
    },
    {
      id: '4',
      name: 'St. Mary\'s Medical Center',
      address: 'Dhaka',
      phone: '018935-61910',
      distance: 2.1,
      type: 'hospital',
    },
    {
      id: '5',
      name: 'QuickCare Pharmacy',
      address: '654 Medicine Way, Dhaka',
      phone: '+91555-0105',
      distance: 1.8,
      type: 'pharmacy',
    },
  ];

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return Hospital;
      case 'pharmacy':
        return PharmacyIcon;
      case 'clinic':
        return Stethoscope;
      default:
        return Hospital;
    }
  };

  const getFacilityColor = (type: string) => {
    switch (type) {
      case 'hospital':
        return 'text-red-600';
      case 'pharmacy':
        return 'text-green-600';
      case 'clinic':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const relationOptions = [
    'Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Colleague', 
    'Doctor', 'Neighbor', 'Relative', 'Emergency', 'Medical', 'Other'
  ];

  // Reset form and set defaults when modal opens
  const handleModalOpen = () => {
    setIsModalOpen(true);
    reset({
      name: '',
      relation: '',
      phone: '',
      location: '',
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Emergency Assistance</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage emergency contacts and find nearby medical facilities
            </p>
          </div>
          <Button
            onClick={handleModalOpen}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Contact</span>
          </Button>
        </div>
      </motion.div>

      {/* SOS Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Emergency SOS
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Press and hold the SOS button to alert your emergency contacts
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSOSClick}
            disabled={isSOSActive}
            className={`w-32 h-32 rounded-full font-bold text-white text-xl transition-all duration-200 ${
              isSOSActive 
                ? 'bg-orange-500 animate-pulse' 
                : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSOSActive ? (
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 mb-1" />
                <span className="text-sm">ACTIVE</span>
              </div>
            ) : (
              'SOS'
            )}
          </motion.button>
          {isSOSActive && (
            <p className="text-orange-600 dark:text-orange-400 mt-4 font-medium">
              Emergency alert sent to all contacts!
            </p>
          )}
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Emergency Contacts
              </h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>{emergencyContacts.length} contacts</span>
              </div>
            </div>
            
            {emergencyContacts.length > 0 ? (
              <div className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <motion.div 
                    key={contact.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                        <Users className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{contact.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relation}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3" />
                            <span>{contact.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(`tel:${contact.phone}`)}
                        className="flex items-center space-x-1"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Call</span>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id, contact.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No emergency contacts added yet</p>
                <p className="text-gray-400 dark:text-gray-500 mb-6">Add your first contact to get started!</p>
                <Button
                  onClick={handleModalOpen}
                  className="flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Contact</span>
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Nearby Facilities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Nearby Medical Facilities
            </h3>
            
            <div className="space-y-4">
              {nearbyFacilities.map((facility) => {
                const IconComponent = getFacilityIcon(facility.type);
                const iconColor = getFacilityColor(facility.type);
                
                return (
                  <div key={facility.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-full">
                        <IconComponent className={`h-5 w-5 ${iconColor}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{facility.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{facility.type}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3" />
                            <span>{facility.distance} km away</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Phone className="h-3 w-3" />
                            <span>{facility.phone}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {facility.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(`tel:${facility.phone}`)}
                        className="flex items-center space-x-1"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Call</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(facility.address)}`)}
                        className="flex items-center space-x-1"
                      >
                        <Navigation className="h-3 w-3" />
                        <span>Directions</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Add Emergency Contact"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="e.g., John Doe"
              disabled={isSubmitting}
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Relation
              </label>
              <select
                {...register('relation')}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onChange={(e) => {
                  e.preventDefault();
                  setValue('relation', e.target.value, { shouldValidate: true });
                }}
              >
                <option value="">Select relation</option>
                {relationOptions.map(relation => (
                  <option key={relation} value={relation}>{relation}</option>
                ))}
              </select>
              {errors.relation && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.relation.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
              <Input
                label="Phone Number"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="e.g., +1-555-0123"
                disabled={isSubmitting}
              />

              <Input
                label="Location/Address"
                {...register('location')}
                error={errors.location?.message}
                placeholder="e.g., Same City, 123 Main St"
                disabled={isSubmitting}
              />
            </div>

            {/* Contact Preview */}
            {(watchedValues.name || watchedValues.phone || watchedValues.relation) && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  Contact Preview
                </h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">Name:</span>
                    <span className="font-medium text-red-700 dark:text-red-300">{watchedValues.name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">Relation:</span>
                    <span className="font-medium text-red-700 dark:text-red-300">{watchedValues.relation || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">Phone:</span>
                    <span className="font-medium text-red-700 dark:text-red-300">{watchedValues.phone || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">Location:</span>
                    <span className="font-medium text-red-700 dark:text-red-300">{watchedValues.location || 'Not set'}</span>
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
                  <span>Adding Contact...</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span>Add Contact</span>
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

export default Emergency;