import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { stepsToCalories, stepsToDistance } from '../utils/calculations';
import { exercises, getCaloriesBurned } from '../data/exercises';
import { formatDuration, getWeekDays } from '../utils/formatters';
import ProgressRing from '../components/UI/ProgressRing';
import AnimatedCounter from '../components/UI/AnimatedCounter';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function ActivityTracker() {
  const { profile, goals, todaySteps, todayActivities, dispatch, steps: allSteps } = useUser();
  const { isDark } = useTheme();
  const [showAddSteps, setShowAddSteps] = useState(false);
  const [showLogExercise, setShowLogExercise] = useState(false);
  const [manualSteps, setManualSteps] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [toast, setToast] = useState(null);
  const [session, setSession] = useState(null);
  const timerRef = useRef(null);

  const startSession = (type) => { setSession({ type, startTime: Date.now(), elapsed: 0 }); };

  useEffect(() => {
    if (session) {
      timerRef.current = setInterval(() => {
        setSession(prev => prev ? { ...prev, elapsed: Math.floor((Date.now() - prev.startTime) / 1000) } : null);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [session?.startTime]);

  const stopSession = () => {
    if (!session) return;
    const durationMin = session.elapsed / 60;
    const cal = getCaloriesBurned(session.type, durationMin, profile.weight);
    const ex = exercises.find(e => e.id === session.type);
    dispatch({ type: 'ADD_ACTIVITY', payload: { type: session.type, name: ex?.name || session.type, duration: session.elapsed, caloriesBurned: cal } });
    setSession(null);
    clearInterval(timerRef.current);
    setToast({ message: `${ex?.name} logged! Burned ${cal} cal`, type: 'success' });
  };

  const addManualSteps = () => {
    const val = parseInt(manualSteps);
    if (val > 0) {
      dispatch({ type: 'ADD_STEPS', payload: val });
      setManualSteps('');
      setShowAddSteps(false);
      setToast({ message: `Added ${val.toLocaleString()} steps!`, type: 'success' });
    }
  };

  const logExercise = () => {
    if (!selectedExercise) return;
    const cal = getCaloriesBurned(selectedExercise.id, exerciseDuration, profile.weight);
    dispatch({ type: 'ADD_ACTIVITY', payload: { type: selectedExercise.id, name: selectedExercise.name, duration: exerciseDuration * 60, caloriesBurned: cal } });
    setShowLogExercise(false);
    setSelectedExercise(null);
    setToast({ message: `${selectedExercise.name} logged! Burned ${cal} cal`, type: 'success' });
  };

  const stepsProgress = (todaySteps / goals.steps) * 100;
  const distance = stepsToDistance(todaySteps, profile.height);
  const stepsCal = stepsToCalories(todaySteps, profile.weight);
  const weekDays = getWeekDays();
  const weekData = weekDays.map(d => ({ day: d.label, steps: allSteps[d.key] || 0, isToday: d.isToday }));
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div className="page-content" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <motion.div variants={item}>
        <h1 style={{ marginBottom: '4px' }}>Activity</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Track your steps & workouts</p>
      </motion.div>

      {session && (
        <motion.div variants={item} className="card" style={{ marginBottom: '16px', background: 'var(--accent-primary)', color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{exercises.find(e => e.id === session.type)?.name || 'Workout'}</div>
          <div className="stat-value" style={{ fontSize: '3rem', marginBottom: '4px' }}>{formatDuration(session.elapsed)}</div>
          <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '16px' }}>~{getCaloriesBurned(session.type, session.elapsed / 60, profile.weight)} cal burned</div>
          <button className="btn" style={{ background: 'white', color: '#000', fontWeight: 700 }} onClick={stopSession}>Stop & Save</button>
        </motion.div>
      )}

      <motion.div variants={item} className="card" style={{ marginBottom: '16px', textAlign: 'center' }}>
        <ProgressRing size={160} strokeWidth={14} progress={stepsProgress} color="var(--steps-color)">
          <AnimatedCounter value={todaySteps} className="stat-value" style={{ fontSize: '2rem' }} />
          <span className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>of {goals.steps.toLocaleString()}</span>
        </ProgressRing>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
          <div><div className="text-number" style={{ fontSize: '1.1rem' }}>{distance}</div><div className="text-xs" style={{ color: 'var(--text-secondary)' }}>km</div></div>
          <div><div className="text-number" style={{ fontSize: '1.1rem' }}>{stepsCal}</div><div className="text-xs" style={{ color: 'var(--text-secondary)' }}>cal</div></div>
          <div><div className="text-number" style={{ fontSize: '1.1rem' }}>{Math.round(todaySteps / Math.max(1, new Date().getHours()))}</div><div className="text-xs" style={{ color: 'var(--text-secondary)' }}>steps/hr</div></div>
        </div>
        <button className="btn btn-secondary" style={{ marginTop: '16px' }} onClick={() => setShowAddSteps(true)}>+ Add Steps Manually</button>
      </motion.div>

      {!session && (
        <motion.div variants={item} style={{ marginBottom: '16px' }}>
          <h3 style={{ marginBottom: '12px' }}>Quick Start</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { id: 'walking', name: 'Walk' },
              { id: 'running', name: 'Run' },
              { id: 'cycling', name: 'Cycle' },
            ].map(act => (
              <button key={act.id} className="card card-interactive text-center" onClick={() => startSession(act.id)} style={{ cursor: 'pointer', padding: '16px' }}>
                <div className="font-semibold">{act.name}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="card" style={{ marginBottom: '16px' }}>
        <h4 style={{ marginBottom: '16px' }}>This Week</h4>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2D2D30' : '#E5E5EA'} vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? '#A1A1AA' : '#6B6B6B' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: isDark ? '#1C1C1E' : '#FFF', border: `1px solid ${isDark ? '#2D2D30' : '#E5E5EA'}`, borderRadius: '8px', color: isDark ? '#FFF' : '#000' }} formatter={(val) => [val.toLocaleString(), 'Steps']} />
            <Bar dataKey="steps" fill="var(--steps-color)" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div variants={item}>
        <button className="btn btn-primary btn-block" onClick={() => setShowLogExercise(true)} id="log-exercise-btn">+ Log Exercise</button>
      </motion.div>

      {todayActivities.length > 0 && (
        <motion.div variants={item} style={{ marginTop: '16px' }}>
          <h3 style={{ marginBottom: '12px' }}>Today's Workouts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayActivities.map(act => (
              <div key={act.id} className="meal-card">
                <div className="meal-card-icon" style={{ background: 'var(--accent-primary-light)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{act.name.charAt(0)}</div>
                <div style={{ flex: 1 }}><div className="font-semibold">{act.name}</div><div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDuration(act.duration)}</div></div>
                <div className="text-right"><div className="font-semibold" style={{ color: 'var(--accent-primary)' }}>-{act.caloriesBurned}</div><div className="text-xs" style={{ color: 'var(--text-secondary)' }}>cal</div></div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <Modal isOpen={showAddSteps} onClose={() => setShowAddSteps(false)} title="Add Steps">
        <div className="input-group"><label>Number of Steps</label><input type="number" value={manualSteps} onChange={e => setManualSteps(e.target.value)} placeholder="e.g. 5000" autoFocus /></div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[1000, 2000, 5000, 8000, 10000].map(v => (<button key={v} className="quick-action-btn" onClick={() => setManualSteps(String(v))}>{v.toLocaleString()}</button>))}
        </div>
        <button className="btn btn-primary btn-block" onClick={addManualSteps}>Add Steps</button>
      </Modal>

      <Modal isOpen={showLogExercise} onClose={() => setShowLogExercise(false)} title="Log Exercise">
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
          {exercises.map(ex => (
            <button key={ex.id} className={`option-card ${selectedExercise?.id === ex.id ? 'selected' : ''}`} onClick={() => setSelectedExercise(ex)} style={{ marginBottom: '6px' }}>
              <div style={{ flex: 1 }}>
                <div className="font-semibold">{ex.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>~{(ex.met * 3.5 * profile.weight / 200).toFixed(0)} cal/min</div>
              </div>
            </button>
          ))}
        </div>
        {selectedExercise && (
          <>
            <div className="input-group"><label>Duration (minutes)</label><input type="number" value={exerciseDuration} onChange={e => setExerciseDuration(+e.target.value)} /></div>
            <div className="card card-sm" style={{ marginBottom: '16px', textAlign: 'center', background: 'var(--accent-primary-light)' }}>
              <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>~{getCaloriesBurned(selectedExercise.id, exerciseDuration, profile.weight)} cal</span>
            </div>
            <button className="btn btn-primary btn-block" onClick={logExercise}>Log Exercise</button>
          </>
        )}
      </Modal>
    </motion.div>
  );
}
