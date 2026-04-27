import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useUser } from './context/UserContext';
import Navbar from './components/Layout/Navbar';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import MealScanner from './pages/MealScanner';
import CalorieCalculator from './pages/CalorieCalculator';
import ActivityTracker from './pages/ActivityTracker';
import FoodLog from './pages/FoodLog';
import BodyComparison from './pages/BodyComparison';
import Progress from './pages/Progress';
import WaterTracker from './pages/WaterTracker';
import Profile from './pages/Profile';

function App() {
  const location = useLocation();
  const { profile } = useUser();

  // Show onboarding if not completed
  if (!profile.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  const hideNav = ['/onboarding', '/scan'].includes(location.pathname);

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<MealScanner />} />
          <Route path="/calculator" element={<CalorieCalculator />} />
          <Route path="/activity" element={<ActivityTracker />} />
          <Route path="/food-log" element={<FoodLog />} />
          <Route path="/body" element={<BodyComparison />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/water" element={<WaterTracker />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>

      {!hideNav && <Navbar />}
    </div>
  );
}

export default App;
