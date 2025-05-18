import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useWeightStore } from '../../store/weightStore';
import DashboardCard from './DashboardCard';

const CurrentWeight: React.FC = () => {
  const { getCurrentWeight, getWeightTrend } = useWeightStore();
  
  const currentWeight = getCurrentWeight();
  const weightTrend = getWeightTrend();
  
  const getTrendIcon = () => {
    if (weightTrend < 0) return <TrendingDown className="text-success-500" size={20} />;
    if (weightTrend > 0) return <TrendingUp className="text-error-500" size={20} />;
    return <Minus className="text-gray-500" size={20} />;
  };
  
  const getTrendText = () => {
    if (weightTrend < 0) return "down";
    if (weightTrend > 0) return "up";
    return "no change";
  };
  
  const getTrendClass = () => {
    if (weightTrend < 0) return "text-success-500";
    if (weightTrend > 0) return "text-error-500";
    return "text-gray-500";
  };

  return (
    <DashboardCard title="Current Weight" delay={1} className="h-full">
      <div className="flex flex-col h-full justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-end"
        >
          <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            {currentWeight}
          </span>
          <span className="ml-1 text-xl text-gray-500 dark:text-gray-400 mb-1">kg</span>
        </motion.div>
        
        <div className="mt-2 flex items-center text-sm">
          <span className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={getTrendClass()}>
              {Math.abs(weightTrend)} kg {getTrendText()}
            </span>
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">
            from previous
          </span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Track your weight regularly for better insights
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default CurrentWeight;