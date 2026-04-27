import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { getWeekDays } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import ProgressRing from '../components/UI/ProgressRing';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Progress() {
  const { goals, meals, weights, steps, water, streaks, dispatch, profile } = useUser();
  const { isDark } = useTheme();
  const [tab, setTab] = useState('weight');
  const [showWeightLog, setShowWeightLog] = useState(false);
  const [weightInput, setWeightInput] = useState(String(profile.weight));
  const [toast, setToast] = useState(null);

  const logWeight = () => {
    const w = parseFloat(weightInput);
    if (w > 0) {
      dispatch({ type: 'LOG_WEIGHT', payload: w });
      setShowWeightLog(false);
      setToast({ message: `Weight logged: ${w} kg`, type: 'success' });
    }
  };

  const weekDays = getWeekDays();
  const weekCalData = weekDays.map(d => {
    const dayMeals = meals[d.key] || [];
    const totalCal = dayMeals.reduce((s, m) => s + m.calories, 0);
    return { day: d.label, calories: totalCal, goal: goals.calories };
  });

  const weightEntries = Object.entries(weights).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
  const weightData = weightEntries.map(([date, w]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: w,
  }));

  const stepsData = weekDays.map(d => ({ day: d.label, steps: steps[d.key] || 0 }));
  const waterData = weekDays.map(d => ({ day: d.label, water: Math.round((water[d.key] || 0) / 1000 * 10) / 10 }));

  const thisWeekCals = weekCalData.reduce((s, d) => s + d.calories, 0);
  const avgCals = Math.round(thisWeekCals / 7);
  const avgSteps = Math.round(stepsData.reduce((s, d) => s + d.steps, 0) / 7);

  const axisStyle = { fontSize: 11, fill: isDark ? '#A1A1AA' : '#6B6B6B' };
  const gridColor = isDark ? '#2D2D30' : '#E5E5EA';
  const tooltipStyle = { background: isDark ? '#1C1C1E' : '#FFF', border: `1px solid ${gridColor}`, borderRadius: '8px', color: isDark ? '#FFF' : '#000' };

  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div className="page-content" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <motion.div variants={item}>
        <h1 style={{ marginBottom: '4px' }}>Progress</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Track your journey</p>
      </motion.div>

      <motion.div variants={item} className="widget-grid" style={{ marginBottom: '16px' }}>
        <div className="card text-center">
          <div style={{ marginBottom: '8px', color: 'var(--accent-primary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>
          </div>
          <div className="stat-value">{streaks.current}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="card text-center">
          <div style={{ marginBottom: '8px', color: 'var(--accent-secondary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
          <div className="stat-value">{streaks.best}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </motion.div>

      <motion.div variants={item} className="widget-grid" style={{ marginBottom: '16px' }}>
        <div className="card text-center">
          <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Avg Calories</div>
          <div className="text-number" style={{ fontSize: '1.3rem' }}>{avgCals}</div>
          <div className="text-xs" style={{ color: avgCals <= goals.calories ? 'var(--accent-primary)' : 'var(--accent-danger)' }}>
            {avgCals <= goals.calories ? '✓ On track' : '! Over target'}
          </div>
        </div>
        <div className="card text-center">
          <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Avg Steps</div>
          <div className="text-number" style={{ fontSize: '1.3rem' }}>{avgSteps.toLocaleString()}</div>
          <div className="text-xs" style={{ color: avgSteps >= goals.steps ? 'var(--accent-primary)' : 'var(--accent-warning)' }}>
            {avgSteps >= goals.steps ? '✓ Goal met' : `${Math.round(avgSteps / goals.steps * 100)}% of goal`}
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} style={{ marginBottom: '16px' }}>
        <div className="tabs">
          {[
            { key: 'weight', label: 'Weight' },
            { key: 'calories', label: 'Calories' },
            { key: 'steps', label: 'Steps' },
            { key: 'water', label: 'Water' },
          ].map(t => (
            <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="card" style={{ marginBottom: '16px' }}>
        {tab === 'weight' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4>Weight Trend</h4>
              <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => setShowWeightLog(true)}>+ Log Weight</button>
            </div>
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="weight" stroke="var(--accent-primary)" strokeWidth={2.5} dot={{ fill: 'var(--accent-primary)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
                <p>No weight entries yet</p>
                <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={() => setShowWeightLog(true)}>Log Your Weight</button>
              </div>
            )}
          </>
        )}

        {tab === 'calories' && (
          <>
            <h4 style={{ marginBottom: '16px' }}>This Week</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekCalData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="calories" fill="var(--calories-color)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {tab === 'steps' && (
          <>
            <h4 style={{ marginBottom: '16px' }}>Steps This Week</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stepsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="steps" fill="var(--steps-color)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {tab === 'water' && (
          <>
            <h4 style={{ marginBottom: '16px' }}>Water Intake (L)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={waterData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="water" fill="var(--water-color)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </motion.div>

      <Modal isOpen={showWeightLog} onClose={() => setShowWeightLog(false)} title="Log Weight">
        <div className="input-group">
          <label>Weight (kg)</label>
          <input type="number" value={weightInput} onChange={e => setWeightInput(e.target.value)} step="0.1" autoFocus />
        </div>
        <button className="btn btn-primary btn-block" onClick={logWeight}>Save</button>
      </Modal>
    </motion.div>
  );
}
