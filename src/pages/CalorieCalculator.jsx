import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { calculateBMR, calculateTDEE, calculateGoalCalories, calculateMacros, calculateBMI, getBMICategory } from '../utils/calculations';
import { motion } from 'framer-motion';
import ProgressRing from '../components/UI/ProgressRing';

export default function CalorieCalculator() {
  const { profile, goals } = useUser();
  const [form, setForm] = useState({
    age: profile.age,
    gender: profile.gender,
    height: profile.height,
    weight: profile.weight,
    activityLevel: profile.activityLevel,
    goal: profile.goal,
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const bmr = calculateBMR(form.weight, form.height, form.age, form.gender);
  const tdee = calculateTDEE(bmr, form.activityLevel);
  const goalCal = calculateGoalCalories(tdee, form.goal);
  const macros = calculateMacros(goalCal);
  const bmi = calculateBMI(form.weight, form.height);
  const bmiCat = getBMICategory(bmi);

  const totalMacroGrams = macros.protein + macros.carbs + macros.fat;

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div className="page-content" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      <motion.div variants={item}>
        <h1 style={{ marginBottom: '4px' }}>Calorie Calculator</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Calculate your daily calorie needs</p>
      </motion.div>

      {/* Input Form */}
      <motion.div variants={item} className="card" style={{ marginBottom: '16px' }}>
        <h4 style={{ marginBottom: '16px' }}>Your Details</h4>
        <div className="input-row" style={{ marginBottom: '14px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Age</label>
            <input type="number" value={form.age} onChange={e => update('age', +e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Gender</label>
            <select value={form.gender} onChange={e => update('gender', e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="input-row" style={{ marginBottom: '14px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Height (cm)</label>
            <input type="number" value={form.height} onChange={e => update('height', +e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Weight (kg)</label>
            <input type="number" value={form.weight} onChange={e => update('weight', +e.target.value)} />
          </div>
        </div>
        <div className="input-group" style={{ marginBottom: '14px' }}>
          <label>Activity Level</label>
          <select value={form.activityLevel} onChange={e => update('activityLevel', e.target.value)}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Very Active</option>
            <option value="very-active">Extra Active</option>
          </select>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label>Goal</label>
          <select value={form.goal} onChange={e => update('goal', e.target.value)}>
            <option value="lose-fast">Lose Weight Fast (-750)</option>
            <option value="lose">Lose Weight (-500)</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Gain Weight (+300)</option>
            <option value="gain-fast">Build Muscle (+500)</option>
          </select>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div className="card text-center">
          <div className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>BMR</div>
          <div className="stat-value" style={{ color: 'var(--accent-secondary)' }}>{bmr}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>cal/day</div>
        </div>
        <div className="card text-center">
          <div className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>TDEE</div>
          <div className="stat-value" style={{ color: 'var(--accent-warning)' }}>{tdee}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>cal/day</div>
        </div>
      </motion.div>

      <motion.div variants={item} className="card" style={{ marginBottom: '16px', textAlign: 'center' }}>
        <div className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Your Daily Target</div>
        <div className="stat-value" style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}>{goalCal}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>calories per day</div>
      </motion.div>

      {/* Macro Breakdown */}
      <motion.div variants={item} className="card" style={{ marginBottom: '16px' }}>
        <h4 style={{ marginBottom: '16px' }}>Macro Breakdown</h4>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <ProgressRing size={140} strokeWidth={20} progress={100} color="var(--protein-color)">
            <div className="text-number" style={{ fontSize: '1.3rem' }}>{goalCal}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>cal</div>
          </ProgressRing>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Protein', grams: macros.protein, color: 'var(--protein-color)', pct: Math.round((macros.protein / totalMacroGrams) * 100) },
            { label: 'Carbs', grams: macros.carbs, color: 'var(--carbs-color)', pct: Math.round((macros.carbs / totalMacroGrams) * 100) },
            { label: 'Fat', grams: macros.fat, color: 'var(--fat-color)', pct: Math.round((macros.fat / totalMacroGrams) * 100) },
          ].map(m => (
            <div key={m.label} className="text-center">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, margin: '0 auto 8px' }} />
              <div className="font-bold" style={{ fontSize: '1.1rem' }}>{m.grams}g</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.label}</div>
              <div className="text-xs" style={{ color: m.color, fontWeight: 600, marginTop: '2px' }}>{m.pct}%</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* BMI */}
      <motion.div variants={item} className="card">
        <h4 style={{ marginBottom: '12px' }}>Your BMI</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="stat-value" style={{ color: bmiCat.color }}>{bmi}</div>
          <div>
            <div className="font-semibold" style={{ color: bmiCat.color }}>{bmiCat.label}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Body Mass Index</div>
          </div>
        </div>
        <div style={{ marginTop: '12px', height: '8px', borderRadius: '4px', background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 33%, #F59E0B 66%, #EF4444 100%)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '-4px',
            left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100)}%`,
            width: '16px', height: '16px', borderRadius: '50%',
            background: 'var(--bg-card)', border: '3px solid var(--text-primary)',
            transform: 'translateX(-50%)', transition: 'left 0.5s ease'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>15</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>25</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>35</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>40</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
