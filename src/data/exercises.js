export const exercises = [
  { id: 'walking', name: 'Walking', met: 3.5, category: 'cardio' },
  { id: 'brisk-walking', name: 'Brisk Walking', met: 4.5, category: 'cardio' },
  { id: 'running', name: 'Running', met: 8.0, category: 'cardio' },
  { id: 'cycling', name: 'Cycling', met: 6.0, category: 'cardio' },
  { id: 'swimming', name: 'Swimming', met: 7.0, category: 'cardio' },
  { id: 'jump_rope', name: 'Jump Rope', met: 11.0, category: 'cardio' },
  { id: 'hiit', name: 'HIIT', met: 10.0, category: 'cardio' },
  { id: 'dancing', name: 'Dancing', met: 5.5, category: 'cardio' },
  { id: 'yoga', name: 'Yoga', met: 2.5, category: 'flexibility' },
  { id: 'pilates', name: 'Pilates', met: 3.0, category: 'flexibility' },
  { id: 'stretching', name: 'Stretching', met: 2.0, category: 'flexibility' },
  { id: 'weightlifting', name: 'Weight Lifting', met: 5.0, category: 'strength' },
  { id: 'pushups', name: 'Push-ups', met: 3.8, category: 'strength' },
  { id: 'squats', name: 'Squats', met: 5.0, category: 'strength' },
  { id: 'deadlifts', name: 'Deadlifts', met: 6.0, category: 'strength' },
  { id: 'bench_press', name: 'Bench Press', met: 5.0, category: 'strength' },
  { id: 'pull_ups', name: 'Pull-ups', met: 8.0, category: 'strength' },
  { id: 'plank', name: 'Plank', met: 3.5, category: 'strength' },
  { id: 'elliptical', name: 'Elliptical', met: 5.0, category: 'cardio' },
  { id: 'rowing', name: 'Rowing', met: 7.0, category: 'cardio' },
  { id: 'stair_climbing', name: 'Stair Climbing', met: 9.0, category: 'cardio' },
  { id: 'boxing', name: 'Boxing', met: 7.8, category: 'cardio' },
  { id: 'basketball', name: 'Basketball', met: 6.5, category: 'sports' },
  { id: 'soccer', name: 'Soccer', met: 7.0, category: 'sports' },
  { id: 'tennis', name: 'Tennis', met: 7.3, category: 'sports' },
];

export function getCaloriesBurned(exerciseId, durationMinutes, weightKg = 70) {
  const ex = exercises.find(e => e.id === exerciseId);
  if (!ex) return 0;
  return Math.round(ex.met * 3.5 * weightKg / 200 * durationMinutes);
}
