import React from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar } from 'lucide-react';
import { useWeightStore } from '../../store/weightStore';
import DashboardCard from './DashboardCard';
import dayjs from 'dayjs';

const GoalProgress: React.FC = () => {
  const { getGoalProgress, activeGoal, getCurrentWeight } = useWeightStore();
  
  const progress = getGoalProgress();
  const currentWeight = getCurrentWeight();
  
  if (!activeGoal) return null;
  
  const daysRemaining = dayjs(activeGoal.targetDate).diff(dayjs(), 'day');
  const progressBarVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${progress}%`,
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  return (
    <DashboardCard title="Goal Progress" delay={2} className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Target className="text-accent-500 mr-2" size={18} />
            <span className="font-medium">{activeGoal.targetWeight} kg</span>
          </div>
          <div className="flex items-center">
            <Calendar className="text-primary-500 mr-2" size={18} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Target date reached'}
            </span>
          </div>
        </div>
        
        <div className="mt-1 mb-2">
          <div className="h-5 w-full bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              variants={progressBarVariants}
              initial="initial"
              animate="animate"
              className="h-full bg-gradient-to-r from-secondary-400 to-primary-500 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-1 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Current: {currentWeight} kg
            </span>
            <span className="font-semibold">{progress}% complete</span>
          </div>
        </div>
        
        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-dark-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {progress < 25 ? (
              "You're just getting started! Keep going!"
            ) : progress < 50 ? (
              "Making good progress! Stay consistent!"
            ) : progress < 75 ? (
              "You're well on your way! Keep it up!"
            ) : progress < 100 ? (
              "So close to your goal! You've got this!"
            ) : (
              "Congratulations! You've reached your goal!"
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default GoalProgress;