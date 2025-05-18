import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { useWeightStore, useThemeStore } from '../../store/weightStore';
import { getDateLabel, filterEntriesByTimeRange, groupEntriesByTimeRange, getTimeRangeDescription } from '../../utils/dateUtils';
import { WeightEntry, TimeRange } from '../../types';
import DashboardCard from './DashboardCard';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

// Memoized component for better performance
const WeightChart: React.FC = React.memo(() => {
  const { entries, selectedTimeRange, setSelectedTimeRange, getForecast, activeGoal } = useWeightStore();
  const { isDarkMode } = useThemeStore();
  const chartRef = useRef<ChartJS>(null);
  
  const [filteredEntries, setFilteredEntries] = useState<WeightEntry[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Memoize time ranges to prevent unnecessary re-renders
  const timeRanges = useMemo(() => [
    { value: 'daily' as TimeRange, label: 'Daily' },
    { value: 'weekly' as TimeRange, label: 'Weekly' },
    { value: 'monthly' as TimeRange, label: 'Monthly' },
    { value: 'yearly' as TimeRange, label: 'Yearly' },
    { value: 'all' as TimeRange, label: 'All' }
  ], []);
  
  // Memoize chart data processing
  const processChartData = useCallback((entries: WeightEntry[]) => {
    const filtered = filterEntriesByTimeRange(entries, selectedTimeRange);
    return groupEntriesByTimeRange(filtered, selectedTimeRange);
  }, [selectedTimeRange]);
  
  useEffect(() => {
    const processedData = processChartData(entries);
    setFilteredEntries(processedData);
    
    // Trigger animation when time range changes
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    
    return () => clearTimeout(timer);
  }, [entries, selectedTimeRange, processChartData]);
  
  // Memoize forecast data
  const forecastData = useMemo(() => getForecast(), [getForecast]);
  
  // Memoize chart data configuration
  const chartData = useMemo(() => ({
    labels: filteredEntries.map(entry => getDateLabel(entry.date, selectedTimeRange)),
    datasets: [
      {
        label: 'Weight',
        data: filteredEntries.map(entry => entry.weight),
        borderColor: '#3B82F6', // primary-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // primary-500 with opacity
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3B82F6',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Forecast',
        data: Array(filteredEntries.length).fill(null).concat(
          forecastData.slice(0, 7).map(item => item.weight)
        ),
        borderColor: 'rgba(20, 184, 166, 0.6)', // secondary-500 with opacity
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(20, 184, 166, 0.6)',
        pointBorderColor: '#fff',
        pointRadius: 3,
        tension: 0.3,
        fill: false,
      },
      // Add target weight line if goal exists
      ...(activeGoal ? [{
        label: 'Target',
        data: Array(filteredEntries.length + forecastData.slice(0, 7).length).fill(activeGoal.targetWeight),
        borderColor: 'rgba(249, 115, 22, 0.6)', // accent-500 with opacity
        borderDash: [3, 3],
        pointRadius: 0,
        tension: 0,
        fill: false,
      }] : []),
    ]
  }), [filteredEntries, forecastData, activeGoal, selectedTimeRange]);
  
  // Memoize chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 0.4,
        to: 0.3,
        loop: false
      },
      numbers: {
        type: 'number',
        duration: 1000,
        easing: 'easeInOutQuart',
      },
      y: {
        duration: 1000,
        easing: 'easeInOutQuart',
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: (value: number) => `${value} kg`,
        }
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cornerRadius: 6,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} kg`;
          }
        }
      }
    }
  }), [isDarkMode]);

  // Handle time range selection with feedback
  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setSelectedTimeRange(range);
    // Provide visual feedback
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [setSelectedTimeRange]);

  return (
    <DashboardCard title="Weight Trend" delay={3} className="col-span-full">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
          {getTimeRangeDescription(selectedTimeRange)}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {timeRanges.map(range => (
            <motion.button
              key={range.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTimeRangeChange(range.value)}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                selectedTimeRange === range.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              {range.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="h-[350px] relative">
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm"
          >
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
        
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </DashboardCard>
  );
});

WeightChart.displayName = 'WeightChart';

export default WeightChart;