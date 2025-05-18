import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  delay?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  children, 
  title, 
  className = "", 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`
        bg-white dark:bg-dark-800 
        rounded-xl p-5 
        shadow-lg dark:shadow-none 
        border border-gray-200 dark:border-dark-700 
        backdrop-blur-sm relative overflow-hidden
        hover:shadow-xl transition-shadow duration-300
        hover:border-primary-200 dark:hover:border-primary-700
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center mb-4 pb-3 border-b border-gray-100 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
            {title}
          </h2>
          <div className="ml-auto flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-gray-300 dark:bg-dark-600"
              />
            ))}
          </div>
        </div>
      )}
      {children}
      
      {/* Enhanced decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary-400/10 to-secondary-400/10 dark:from-primary-700/20 dark:to-secondary-700/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-tr from-accent-400/10 to-primary-400/10 dark:from-accent-700/20 dark:to-primary-700/20 blur-xl" />
    </motion.div>
  );
};

export default DashboardCard;