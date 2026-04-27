import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getGreeting } from '../utils/formatters';
import { stepsToCalories, stepsToDistance } from '../utils/calculations';
import ProgressRing from '../components/UI/ProgressRing';
import AnimatedCounter from '../components/UI/AnimatedCounter';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, goals, todayNutrition, todayWater, todaySteps, todayMeals, todayExerciseCalories } = useUser();

  const caloriesRemaining = goals.calories - todayNutrition.calories + todayExerciseCalories;
  const calorieProgress = (todayNutrition.calories / goals.calories) * 100;
  const proteinProgress = goals.protein > 0 ? (todayNutrition.protein / goals.protein) * 100 : 0;
  const carbsProgress = goals.carbs > 0 ? (todayNutrition.carbs / goals.carbs) * 100 : 0;
  const fatProgress = goals.fat > 0 ? (todayNutrition.fat / goals.fat) * 100 : 0;
  const stepsProgress = (todaySteps / goals.steps) * 100;
  const waterProgress = (todayWater / goals.water) * 100;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } }
  };

  return (
    <motion.div
      className="page-content"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Greeting */}
      <motion.div variants={item} style={{ marginBottom: '24px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{getGreeting()}</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{profile.name || 'Champion'}</h1>
      </motion.div>

      {/* Calorie Ring */}
      <motion.div variants={item} className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
        <ProgressRing size={130} strokeWidth={12} progress={calorieProgress} color="var(--accent-primary)">
          <AnimatedCounter value={Math.max(0, caloriesRemaining)} className="stat-value" style={{ fontSize: '1.6rem' }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>remaining</span>
        </ProgressRing>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div className="text-center">
              <div className="text-number" style={{ fontSize: '1.1rem' }}>{goals.calories}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Goal</div>
            </div>
            <div className="text-center">
              <div className="text-number" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{todayNutrition.calories}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Food</div>
            </div>
            <div className="text-center">
              <div className="text-number" style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)' }}>{todayExerciseCalories}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Exercise</div>
            </div>
          </div>

          {/* Macro Bars */}
          {[
            { label: 'Protein', value: todayNutrition.protein, goal: goals.protein, color: 'var(--protein-color)', progress: proteinProgress },
            { label: 'Carbs', value: todayNutrition.carbs, goal: goals.carbs, color: 'var(--carbs-color)', progress: carbsProgress },
            { label: 'Fat', value: todayNutrition.fat, goal: goals.fat, color: 'var(--fat-color)', progress: fatProgress },
          ].map(macro => (
            <div key={macro.label} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="text-xs" style={{ fontWeight: 500 }}>{macro.label}</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{macro.value}g / {macro.goal}g</span>
              </div>
              <div className="macro-bar-track">
                <div className="macro-bar-fill" style={{ width: `${Math.min(macro.progress, 100)}%`, background: macro.color }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} style={{ marginBottom: '16px' }}>
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => navigate('/scan')} id="quick-scan">
            Scan Meal
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/food-log')} id="quick-log">
            Log Food
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/water')} id="quick-water">
            Water
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/activity')} id="quick-activity">
            Activity
          </button>
        </div>
      </motion.div>

      {/* Steps & Water Widgets */}
      <motion.div variants={item} className="widget-grid" style={{ marginBottom: '16px' }}>
        <div className="card card-interactive" onClick={() => navigate('/activity')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--steps-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span className="text-sm font-semibold">Steps</span>
          </div>
          <ProgressRing size={80} strokeWidth={7} progress={stepsProgress} color="var(--steps-color)">
            <AnimatedCounter value={todaySteps} className="text-number" style={{ fontSize: '1rem' }} />
          </ProgressRing>
          <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center' }}>
            {todaySteps.toLocaleString()} / {goals.steps.toLocaleString()}
          </div>
        </div>

        <div className="card card-interactive" onClick={() => navigate('/water')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--water-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            <span className="text-sm font-semibold">Water</span>
          </div>
          <ProgressRing size={80} strokeWidth={7} progress={waterProgress} color="var(--water-color)">
            <AnimatedCounter value={Math.round(todayWater / 1000 * 10) / 10} className="text-number" style={{ fontSize: '1rem' }} suffix="L" />
          </ProgressRing>
          <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center' }}>
            {(todayWater / 1000).toFixed(1)}L / {(goals.water / 1000).toFixed(1)}L
          </div>
        </div>
      </motion.div>

      {/* Today's Meals */}
      <motion.div variants={item}>
        <div className="section-header">
          <h3>Today's Meals</h3>
          <button onClick={() => navigate('/food-log')} style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.85rem' }}>See All</button>
        </div>

        {todayMeals.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No meals logged yet</p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/scan')}>
              Scan Your First Meal
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayMeals.slice(-5).reverse().map(meal => (
              <div key={meal.id} className="meal-card">
                <div className="meal-card-icon" style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {meal.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="font-semibold truncate">{meal.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{meal.calories}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>cal</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
