import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { useWeightStore } from '../../store/weightStore';
import { Trophy, Medal, Award } from 'lucide-react';
import { WeightEntry } from '../../types';
import dayjs from 'dayjs';

interface LeaderboardProps {
  timeRange: 'weekly' | 'monthly' | 'yearly';
}

const Leaderboard: React.FC<LeaderboardProps> = ({ timeRange }) => {
  const { entries } = useWeightStore();
  
  const getTimeRangeData = (entries: WeightEntry[]) => {
    const now = dayjs();
    const filteredEntries = entries.filter(entry => {
      const entryDate = dayjs(entry.date);
      switch (timeRange) {
        case 'weekly':
          return entryDate.isAfter(now.subtract(1, 'week'));
        case 'monthly':
          return entryDate.isAfter(now.subtract(1, 'month'));
        case 'yearly':
          return entryDate.isAfter(now.subtract(1, 'year'));
        default:
          return false;
      }
    });

    const sortedEntries = filteredEntries.sort((a, b) => {
      const weightDiff = Math.abs(b.weight - a.weight);
      return weightDiff;
    });

    return sortedEntries.slice(0, 5);
  };

  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }));
  const leaderboardData = getTimeRangeData(entries);

  const calculateParallax = (x: number, y: number) => {
    const parallaxX = x / 50;
    const parallaxY = y / 50;
    set({ xy: [parallaxX, parallaxY] });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / width;
    const y = (clientY - top - height / 2) / height;
    calculateParallax(x * 100, y * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => set({ xy: [0, 0] })}
    >
      <h3 className="text-xl font-bold mb-4 text-dark-900 dark:text-white">
        {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Leaderboard
      </h3>

      <AnimatePresence>
        {leaderboardData.map((entry, index) => (
          <animated.div
            key={entry.id}
            style={{
              transform: xy.to((x, y) => `translate(${x * (index + 1)}px, ${y * (index + 1)}px)`)
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 mb-2 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {index === 0 && <Trophy className="text-warning-500" size={24} />}
                {index === 1 && <Medal className="text-gray-400" size={24} />}
                {index === 2 && <Award className="text-accent-500" size={24} />}
                <span className="font-semibold text-dark-900 dark:text-white">
                  {entry.weight} kg
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {dayjs(entry.date).format('MMM D, YYYY')}
              </span>
            </motion.div>
          </animated.div>
        ))}
      </AnimatePresence>

      {leaderboardData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          No data available for this time range
        </motion.div>
      )}
    </motion.div>
  );
};

export default Leaderboard;