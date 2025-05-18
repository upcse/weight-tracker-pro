import { create } from 'zustand';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { 
  WeightState, 
  WeightEntry, 
  UserGoal, 
  TimeRange 
} from '../types';
import { 
  generateMockWeightEntries, 
  generateMockGoal, 
  generateMockProfile, 
  generateForecastData,
  generateInsights
} from '../utils/mockData';

// Generate initial mock data
const mockEntries = generateMockWeightEntries();
const lastEntry = mockEntries[mockEntries.length - 1];
const mockGoal = generateMockGoal(lastEntry.weight);
const mockProfile = generateMockProfile();

export const useWeightStore = create<WeightState>((set, get) => ({
  entries: mockEntries,
  goals: [mockGoal],
  profile: mockProfile,
  activeGoal: mockGoal,
  selectedTimeRange: 'daily',
  isAddingWeight: false,
  isLoading: false,

  addWeightEntry: (entryData) => {
    const newEntry: WeightEntry = {
      id: uuidv4(),
      ...entryData
    };

    set((state) => ({
      entries: [...state.entries, newEntry].sort(
        (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
      )
    }));
  },

  setSelectedTimeRange: (range: TimeRange) => {
    set({ selectedTimeRange: range });
  },

  setIsAddingWeight: (isAdding: boolean) => {
    set({ isAddingWeight: isAdding });
  },

  setActiveGoal: (goal: UserGoal | null) => {
    set({ activeGoal: goal });
  },

  getWeightTrend: () => {
    const { entries } = get();
    if (entries.length < 2) return 0;

    const latestEntry = entries[entries.length - 1];
    const previousEntry = entries[entries.length - 2];
    
    return +(latestEntry.weight - previousEntry.weight).toFixed(1);
  },

  getCurrentWeight: () => {
    const { entries } = get();
    if (entries.length === 0) return 0;
    
    return entries[entries.length - 1].weight;
  },

  getGoalProgress: () => {
    const { activeGoal, entries } = get();
    if (!activeGoal || entries.length === 0) return 0;

    const currentWeight = entries[entries.length - 1].weight;
    const totalLossNeeded = activeGoal.startWeight - activeGoal.targetWeight;
    const currentLoss = activeGoal.startWeight - currentWeight;
    
    return Math.min(100, Math.max(0, Math.round((currentLoss / totalLossNeeded) * 100)));
  },

  getForecast: () => {
    const { entries, activeGoal } = get();
    if (!activeGoal) return [];
    
    return generateForecastData(entries, activeGoal);
  },

  getInsights: () => {
    const { entries, activeGoal } = get();
    return generateInsights(entries, activeGoal);
  }
}));

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));