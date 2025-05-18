import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import Layout from './components/layout/Layout';
import CurrentWeight from './components/dashboard/CurrentWeight';
import WeightChart from './components/dashboard/WeightChart';
import GoalProgress from './components/dashboard/GoalProgress';
import InsightsCard from './components/dashboard/InsightsCard';
import Leaderboard from './components/dashboard/Leaderboard';
import WeightForm from './components/forms/WeightForm';
import BackgroundScene from './components/three/BackgroundScene';
import { useWeightStore, useThemeStore } from './store/weightStore';

// Main App component with optimized rendering
const App: React.FC = () => {
  const { entries, isAddingWeight } = useWeightStore();
  const { isDarkMode } = useThemeStore();
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  
  // Memoize the leaderboard selection handler
  const handleLeaderboardSelect = useCallback((range: 'weekly' | 'monthly' | 'yearly') => {
    setSelectedLeaderboard(range);
  }, []);
  
  // Apply dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Layout>
      {/* 3D Background Scene */}
      <BackgroundScene />
      
      <div className="max-w-7xl mx-auto relative overflow-hidden">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-dark-900 dark:text-white"
        >
          Weight Tracking Dashboard
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <CurrentWeight />
          <GoalProgress />
          <InsightsCard />
        </div>
        
        <WeightChart />
        
        <div className="mt-8">
          <div className="flex gap-4 mb-4">
            {(['weekly', 'monthly', 'yearly'] as const).map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLeaderboardSelect(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedLeaderboard === range
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)} Leaders
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLeaderboard}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard timeRange={selectedLeaderboard} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <WeightForm />
    </Layout>
  );
};

export default App;