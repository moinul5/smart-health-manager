import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HealthProvider } from './context/HealthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Nutrition from './pages/Nutrition/Nutrition';
import MentalHealth from './pages/MentalHealth/MentalHealth';
import Fitness from './pages/Fitness/Fitness';
import Medications from './pages/Medications/Medications';
import Emergency from './pages/Emergency/Emergency';
import Pregnancy from './pages/Pregnancy/Pregnancy';
import { useAuth } from './context/AuthContext';

// Protected Pregnancy Route Component
const ProtectedPregnancyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Check if user should have access to pregnancy section
  const hasPregnancyAccess = user && (
    user.gender === 'female' || 
    user.pregnancyStatus === true
  );

  if (!hasPregnancyAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HealthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="nutrition" element={<Nutrition />} />
                <Route path="mental-health" element={<MentalHealth />} />
                <Route path="fitness" element={<Fitness />} />
                <Route path="medications" element={<Medications />} />
                <Route path="emergency" element={<Emergency />} />
                <Route 
                  path="pregnancy" 
                  element={
                    <ProtectedPregnancyRoute>
                      <Pregnancy />
                    </ProtectedPregnancyRoute>
                  } 
                />
                <Route path="" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Router>
        </HealthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;