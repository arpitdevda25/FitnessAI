// BMR using Mifflin-St Jeor equation
export function calculateBMR(weight, height, age, gender) {
  // weight in kg, height in cm, age in years
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

// Activity multipliers
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

export function calculateTDEE(bmr, activityLevel) {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

export function calculateGoalCalories(tdee, goal) {
  switch (goal) {
    case 'lose': return Math.round(tdee - 500);
    case 'lose-fast': return Math.round(tdee - 750);
    case 'gain': return Math.round(tdee + 300);
    case 'gain-fast': return Math.round(tdee + 500);
    default: return tdee; // maintain
  }
}

export function calculateMacros(calories, split = 'balanced') {
  const splits = {
    balanced: { protein: 0.30, carbs: 0.40, fat: 0.30 },
    'high-protein': { protein: 0.40, carbs: 0.35, fat: 0.25 },
    'low-carb': { protein: 0.35, carbs: 0.25, fat: 0.40 },
    keto: { protein: 0.25, carbs: 0.05, fat: 0.70 },
  };
  const s = splits[split] || splits.balanced;
  return {
    protein: Math.round((calories * s.protein) / 4),
    carbs: Math.round((calories * s.carbs) / 4),
    fat: Math.round((calories * s.fat) / 9),
  };
}

export function stepsToCalories(steps, weightKg = 70) {
  // Approx 0.04 kcal per step per kg / 70
  return Math.round(steps * 0.04 * (weightKg / 70));
}

export function stepsToDistance(steps, heightCm = 170) {
  // stride ~= height * 0.414
  const strideM = (heightCm * 0.414) / 100;
  return +(steps * strideM / 1000).toFixed(2); // km
}

export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3B82F6' };
  if (bmi < 25) return { label: 'Normal', color: '#10B981' };
  if (bmi < 30) return { label: 'Overweight', color: '#F59E0B' };
  return { label: 'Obese', color: '#EF4444' };
}

export function caloriesBurnedPerMinute(exercise, weightKg = 70) {
  const MET_VALUES = {
    walking: 3.5,
    'brisk-walking': 4.5,
    running: 8.0,
    cycling: 6.0,
    swimming: 7.0,
    yoga: 2.5,
    weightlifting: 5.0,
    hiit: 10.0,
    dancing: 5.5,
    jump_rope: 11.0,
  };
  const met = MET_VALUES[exercise] || 4.0;
  return +(met * 3.5 * weightKg / 200).toFixed(1);
}
