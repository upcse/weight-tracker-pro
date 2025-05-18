import { WeightEntry, UserGoal, UserProfile } from '../types';
import dayjs from 'dayjs';

// Generate random weight entries for the last 90 days
export const generateMockWeightEntries = (): WeightEntry[] => {
  const entries: WeightEntry[] = [];
  const startWeight = 80; // Starting weight in kg
  const today = dayjs();
  
  for (let i = 90; i >= 0; i--) {
    // Skip some days randomly to make data more realistic
    if (i !== 0 && Math.random() > 0.7) continue;
    
    const date = today.subtract(i, 'day').format('YYYY-MM-DD');
    
    // Generate a realistic weight progression
    // Gradually decrease with some fluctuations
    const trendDecrease = (90 - i) * 0.03; // Gradual decrease over time
    const dailyFluctuation = (Math.random() - 0.5) * 0.8; // Random daily fluctuations
    const weekendEffect = [0, 6].includes(dayjs(date).day()) ? 0.2 : 0; // Slight increase on weekends
    
    const weight = +(startWeight - trendDecrease + dailyFluctuation + weekendEffect).toFixed(1);
    
    entries.push({
      id: `entry-${i}`,
      weight,
      date,
      notes: i % 10 === 0 ? getRandomNote(weight) : undefined,
    });
  }
  
  return entries.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
};

const getRandomNote = (weight: number): string => {
  const notes = [
    'Feeling great today!',
    'Had a cheat meal yesterday',
    'Started new workout routine',
    'Increased water intake',
    'Skipped dessert all week',
    'Feeling motivated by progress',
    'Added 10 minutes to cardio',
    'Reduced carb intake',
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
};

export const generateMockGoal = (currentWeight: number): UserGoal => {
  const targetWeight = currentWeight * 0.9; // 10% weight loss goal
  const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
  const targetDate = dayjs().add(60, 'day').format('YYYY-MM-DD');
  
  return {
    id: 'goal-1',
    targetWeight: +targetWeight.toFixed(1),
    startWeight: currentWeight,
    startDate,
    targetDate,
    isCompleted: false,
  };
};

export const generateMockProfile = (): UserProfile => {
  return {
    id: 'user-1',
    name: 'Alex Johnson',
    height: 175, // cm
    initialWeight: 80, // kg
    measurementUnit: 'kg',
  };
};

export const generateForecastData = (entries: WeightEntry[], goal: UserGoal): { date: string; weight: number }[] => {
  if (entries.length < 7) return [];
  
  // Calculate average weight loss per day from the last 30 days
  const recentEntries = entries.slice(-30);
  if (recentEntries.length < 7) return [];
  
  const oldestEntry = recentEntries[0];
  const newestEntry = recentEntries[recentEntries.length - 1];
  const daysDifference = dayjs(newestEntry.date).diff(dayjs(oldestEntry.date), 'day');
  
  if (daysDifference <= 0) return [];
  
  const weightDifference = oldestEntry.weight - newestEntry.weight;
  const avgWeightLossPerDay = weightDifference / daysDifference;
  
  // Generate forecast for the next 30 days
  const forecast = [];
  const lastEntryDate = dayjs(newestEntry.date);
  const lastWeight = newestEntry.weight;
  
  for (let i = 1; i <= 30; i++) {
    const date = lastEntryDate.add(i, 'day').format('YYYY-MM-DD');
    const weight = +(lastWeight - avgWeightLossPerDay * i).toFixed(1);
    forecast.push({ date, weight });
  }
  
  return forecast;
};

// Generate personalized insights based on weight data
export const generateInsights = (entries: WeightEntry[], goal: UserGoal | null): string[] => {
  if (entries.length < 7) return ['Start tracking your weight consistently to get personalized insights.'];
  
  const insights: string[] = [];
  const recentEntries = entries.slice(-30);
  
  // Calculate weekly average
  const lastWeekEntries = recentEntries.slice(-7);
  const lastWeekAvg = lastWeekEntries.reduce((sum, entry) => sum + entry.weight, 0) / lastWeekEntries.length;
  
  // Calculate weekly trend
  const weekBeforeEntries = recentEntries.slice(-14, -7);
  if (weekBeforeEntries.length > 0) {
    const weekBeforeAvg = weekBeforeEntries.reduce((sum, entry) => sum + entry.weight, 0) / weekBeforeEntries.length;
    const weeklyChange = +(lastWeekAvg - weekBeforeAvg).toFixed(1);
    
    if (weeklyChange < 0) {
      insights.push(`Great job! You've lost ${Math.abs(weeklyChange)}kg in the last week.`);
    } else if (weeklyChange > 0) {
      insights.push(`You've gained ${weeklyChange}kg in the last week.`);
    } else {
      insights.push('Your weight has been stable over the past week.');
    }
  }
  
  // Goal progress
  if (goal) {
    const totalLossNeeded = goal.startWeight - goal.targetWeight;
    const currentLoss = goal.startWeight - entries[entries.length - 1].weight;
    const progressPercent = Math.min(100, Math.round((currentLoss / totalLossNeeded) * 100));
    
    insights.push(`You're ${progressPercent}% of the way to your weight goal.`);
    
    const daysLeft = dayjs(goal.targetDate).diff(dayjs(), 'day');
    if (daysLeft > 0) {
      insights.push(`${daysLeft} days left to reach your target weight.`);
    }
  }
  
  // Consistency insight
  const consistencyRate = recentEntries.length / 30 * 100;
  if (consistencyRate >= 80) {
    insights.push('Excellent tracking consistency! Keep it up for the best results.');
  } else if (consistencyRate >= 50) {
    insights.push('Try to track your weight more consistently for better insights.');
  } else {
    insights.push('Regular tracking leads to better outcomes. Try to weigh in more often.');
  }
  
  return insights;
};