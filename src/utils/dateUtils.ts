import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { WeightEntry, TimeRange } from '../types';

// Register the weekOfYear plugin to enable the week() function
dayjs.extend(weekOfYear);

// Format date for display
export const formatDate = (date: string, format: string = 'MMM D, YYYY'): string => {
  return dayjs(date).format(format);
};

// Get the label for a date based on the selected time range
export const getDateLabel = (date: string, timeRange: TimeRange): string => {
  switch (timeRange) {
    case 'daily':
      return dayjs(date).format('MMM D');
    case 'weekly':
      return `Week ${dayjs(date).week()}`;
    case 'monthly':
      return dayjs(date).format('MMM YYYY');
    case 'yearly':
      return dayjs(date).format('YYYY');
    default:
      return dayjs(date).format('MMM D');
  }
};

// Filter weight entries based on the selected time range
export const filterEntriesByTimeRange = (entries: WeightEntry[], timeRange: TimeRange): WeightEntry[] => {
  const now = dayjs();
  
  switch (timeRange) {
    case 'daily':
      // Last 30 days
      return entries.filter(entry => 
        dayjs(entry.date).isAfter(now.subtract(30, 'day')) || 
        dayjs(entry.date).isSame(now.subtract(30, 'day'), 'day')
      );
    case 'weekly':
      // Last 12 weeks
      return entries.filter(entry => 
        dayjs(entry.date).isAfter(now.subtract(12, 'week')) || 
        dayjs(entry.date).isSame(now.subtract(12, 'week'), 'day')
      );
    case 'monthly':
      // Last 12 months
      return entries.filter(entry => 
        dayjs(entry.date).isAfter(now.subtract(12, 'month')) || 
        dayjs(entry.date).isSame(now.subtract(12, 'month'), 'day')
      );
    case 'yearly':
      // Last 5 years
      return entries.filter(entry => 
        dayjs(entry.date).isAfter(now.subtract(5, 'year')) || 
        dayjs(entry.date).isSame(now.subtract(5, 'year'), 'day')
      );
    case 'all':
    default:
      return entries;
  }
};

// Group entries by time range for chart display
export const groupEntriesByTimeRange = (entries: WeightEntry[], timeRange: TimeRange): WeightEntry[] => {
  if (timeRange === 'daily' || entries.length === 0) {
    return entries;
  }
  
  const groupedEntries: { [key: string]: WeightEntry[] } = {};
  
  entries.forEach(entry => {
    let groupKey: string;
    
    switch (timeRange) {
      case 'weekly':
        // Group by week
        groupKey = `${dayjs(entry.date).year()}-W${dayjs(entry.date).week()}`;
        break;
      case 'monthly':
        // Group by month
        groupKey = dayjs(entry.date).format('YYYY-MM');
        break;
      case 'yearly':
        // Group by year
        groupKey = dayjs(entry.date).format('YYYY');
        break;
      default:
        groupKey = entry.date;
    }
    
    if (!groupedEntries[groupKey]) {
      groupedEntries[groupKey] = [];
    }
    
    groupedEntries[groupKey].push(entry);
  });
  
  // For each group, calculate the average weight and use the last date in the group
  return Object.entries(groupedEntries).map(([groupKey, groupEntries]) => {
    const avgWeight = groupEntries.reduce((sum, entry) => sum + entry.weight, 0) / groupEntries.length;
    const latestEntry = groupEntries.sort((a, b) => 
      dayjs(b.date).unix() - dayjs(a.date).unix()
    )[0];
    
    return {
      id: `group-${groupKey}`,
      weight: +avgWeight.toFixed(1),
      date: latestEntry.date,
      notes: latestEntry.notes,
    };
  }).sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
};

// Get date range description for the selected time range
export const getTimeRangeDescription = (timeRange: TimeRange): string => {
  switch (timeRange) {
    case 'daily':
      return 'Last 30 days';
    case 'weekly':
      return 'Last 12 weeks';
    case 'monthly':
      return 'Last 12 months';
    case 'yearly':
      return 'Last 5 years';
    case 'all':
      return 'All time';
    default:
      return 'Custom range';
  }
};