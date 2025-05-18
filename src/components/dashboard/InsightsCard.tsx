import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useWeightStore } from '../../store/weightStore';
import DashboardCard from './DashboardCard';

const InsightsCard: React.FC = () => {
  const { getInsights } = useWeightStore();
  const insights = getInsights();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardCard title="Insights" delay={4} className="h-full">
      {insights.length > 0 ? (
        <motion.ul
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {insights.slice(0, 3).map((insight, index) => (
            <motion.li 
              key={index} 
              variants={item}
              className="flex items-start"
            >
              <span className="mr-2 mt-0.5 flex-shrink-0">
                <Lightbulb size={16} className="text-accent-500" />
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {insight}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
          Add more weight entries to generate insights
        </div>
      )}
    </DashboardCard>
  );
};

export default InsightsCard;