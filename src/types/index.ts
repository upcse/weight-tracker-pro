export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

export interface UserGoal {
  id: string;
  targetWeight: number;
  startWeight: number;
  startDate: string;
  targetDate: string;
  isCompleted: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  height: number; // in cm
  initialWeight: number;
  measurementUnit: 'kg' | 'lbs';
}

export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';

export interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface WeightState {
  entries: WeightEntry[];
  goals: UserGoal[];
  profile: UserProfile;
  activeGoal: UserGoal | null;
  selectedTimeRange: TimeRange;
  isAddingWeight: boolean;
  isLoading: boolean;
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  setSelectedTimeRange: (range: TimeRange) => void;
  setIsAddingWeight: (isAdding: boolean) => void;
  setActiveGoal: (goal: UserGoal | null) => void;
  getWeightTrend: () => number;
  getCurrentWeight: () => number;
  getGoalProgress: () => number;
  getForecast: () => { date: string; weight: number }[];
}