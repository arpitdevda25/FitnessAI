import { createContext, useContext, useReducer, useEffect } from 'react';
import { getDateKey } from '../utils/formatters';
import { calculateBMR, calculateTDEE, calculateGoalCalories, calculateMacros } from '../utils/calculations';

const UserContext = createContext();

const DEFAULT_PROFILE = {
  name: '',
  age: 25,
  gender: 'male',
  height: 175,
  weight: 70,
  activityLevel: 'moderate',
  goal: 'maintain',
  macroSplit: 'balanced',
  onboarded: false,
};

function calculateGoals(profile) {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calorieGoal = calculateGoalCalories(tdee, profile.goal);
  const macros = calculateMacros(calorieGoal, profile.macroSplit);
  return {
    bmr,
    tdee,
    calories: calorieGoal,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    water: Math.round(profile.weight * 35), // ml
    steps: 10000,
  };
}

const initialState = {
  profile: DEFAULT_PROFILE,
  goals: calculateGoals(DEFAULT_PROFILE),
  meals: {},       // { "2026-04-27": [{ id, name, calories, protein, carbs, fat, mealType, time, icon }] }
  water: {},       // { "2026-04-27": 0 }  (ml)
  steps: {},       // { "2026-04-27": 0 }
  weights: {},     // { "2026-04-27": 70 }
  activities: {},  // { "2026-04-27": [{ type, duration, caloriesBurned, time }] }
  bodyPhotos: [],  // [{ id, date, imageData, type: 'front'|'side'|'back' }]
  measurements: {},// { "2026-04-27": { chest, waist, hips, arms, thighs } }
  streaks: { current: 0, best: 0, lastLogDate: null },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE': {
      const profile = { ...state.profile, ...action.payload };
      const goals = calculateGoals(profile);
      return { ...state, profile, goals };
    }
    case 'COMPLETE_ONBOARDING':
      return { ...state, profile: { ...state.profile, onboarded: true } };
    case 'ADD_MEAL': {
      const dateKey = getDateKey();
      const existing = state.meals[dateKey] || [];
      return {
        ...state,
        meals: { ...state.meals, [dateKey]: [...existing, { ...action.payload, id: Date.now(), time: new Date().toISOString() }] },
      };
    }
    case 'REMOVE_MEAL': {
      const dk = getDateKey();
      return {
        ...state,
        meals: { ...state.meals, [dk]: (state.meals[dk] || []).filter(m => m.id !== action.payload) },
      };
    }
    case 'ADD_WATER': {
      const dk = getDateKey();
      return { ...state, water: { ...state.water, [dk]: (state.water[dk] || 0) + action.payload } };
    }
    case 'SET_STEPS': {
      const dk = getDateKey();
      return { ...state, steps: { ...state.steps, [dk]: action.payload } };
    }
    case 'ADD_STEPS': {
      const dk = getDateKey();
      return { ...state, steps: { ...state.steps, [dk]: (state.steps[dk] || 0) + action.payload } };
    }
    case 'LOG_WEIGHT': {
      const dk = getDateKey();
      return { ...state, weights: { ...state.weights, [dk]: action.payload } };
    }
    case 'ADD_ACTIVITY': {
      const dk = getDateKey();
      const existing = state.activities[dk] || [];
      return {
        ...state,
        activities: { ...state.activities, [dk]: [...existing, { ...action.payload, id: Date.now(), time: new Date().toISOString() }] },
      };
    }
    case 'ADD_BODY_PHOTO':
      return {
        ...state,
        bodyPhotos: [...state.bodyPhotos, { ...action.payload, id: Date.now(), date: new Date().toISOString() }],
      };
    case 'LOG_MEASUREMENTS': {
      const dk = getDateKey();
      return { ...state, measurements: { ...state.measurements, [dk]: action.payload } };
    }
    case 'UPDATE_STREAK': {
      const today = getDateKey();
      if (state.streaks.lastLogDate === today) return state;
      const yesterday = getDateKey(new Date(Date.now() - 86400000));
      const isConsecutive = state.streaks.lastLogDate === yesterday;
      const newCurrent = isConsecutive ? state.streaks.current + 1 : 1;
      return {
        ...state,
        streaks: {
          current: newCurrent,
          best: Math.max(newCurrent, state.streaks.best),
          lastLogDate: today,
        },
      };
    }
    case 'LOAD_STATE':
      return { ...action.payload };
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('fitnessai-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed, goals: calculateGoals({ ...init.profile, ...parsed.profile }) };
      }
    } catch {}
    return init;
  });

  useEffect(() => {
    localStorage.setItem('fitnessai-data', JSON.stringify(state));
  }, [state]);

  // Computed values for today
  const today = getDateKey();
  const todayMeals = state.meals[today] || [];
  const todayWater = state.water[today] || 0;
  const todaySteps = state.steps[today] || 0;
  const todayActivities = state.activities[today] || [];

  const todayNutrition = todayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const todayExerciseCalories = todayActivities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);

  return (
    <UserContext.Provider value={{
      ...state,
      dispatch,
      today,
      todayMeals,
      todayWater,
      todaySteps,
      todayActivities,
      todayNutrition,
      todayExerciseCalories,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
