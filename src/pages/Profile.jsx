import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/UI/ThemeToggle';
import Toast from '../components/UI/Toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { profile, goals, dispatch } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [toast, setToast] = useState(null);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const saveProfile = () => {
    dispatch({ type: 'SET_PROFILE', payload: form });
    setEditing(false);
    setToast({ message: 'Profile updated!', type: 'success' });
  };

  const resetData = () => {
    if (confirm('Are you sure? This will clear all your data.')) {
      localStorage.removeItem('fitnessai-data');
      window.location.reload();
    }
  };

  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div className="page-content" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <motion.div variants={item}>
        <h1 style={{ marginBottom: '24px' }}>Profile</h1>
      </motion.div>

      {/* Avatar */}
      <motion.div variants={item} className="card" style={{ marginBottom: '16px', textAlign: 'center', padding: '32px 20px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2.5rem' }}>
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h2>{profile.name || 'User'}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          {profile.age} yrs • {profile.height} cm • {profile.weight} kg
        </p>
      </motion.div>

      {/* Theme */}
      <motion.div variants={item} className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="font-semibold">Appearance</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {isDark ? 'Dark mode' : 'Light mode'}
            </div>
          </div>
          <ThemeToggle showLabel={false} />
        </div>
      </motion.div>

      {/* Daily Goals */}
      <motion.div variants={item} className="card" style={{ marginBottom: '16px' }}>
        <h4 style={{ marginBottom: '16px' }}>Daily Goals</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[
            { label: 'Calories', value: `${goals.calories} kcal` },
            { label: 'Protein', value: `${goals.protein}g` },
            { label: 'Carbs', value: `${goals.carbs}g` },
            { label: 'Fat', value: `${goals.fat}g` },
            { label: 'Water', value: `${(goals.water / 1000).toFixed(1)}L` },
            { label: 'Steps', value: goals.steps.toLocaleString() },
          ].map(g => (
            <div key={g.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <div className="font-semibold">{g.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{g.label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Edit Profile */}
      <motion.div variants={item} className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editing ? '16px' : 0 }}>
          <h4>Edit Profile</h4>
          <button onClick={() => setEditing(!editing)} style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing && (
          <div>
            <div className="input-group">
              <label>Name</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
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
            <div className="input-group">
              <label>Activity Level</label>
              <select value={form.activityLevel} onChange={e => update('activityLevel', e.target.value)}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Very Active</option>
                <option value="very-active">Extra Active</option>
              </select>
            </div>
            <div className="input-group">
              <label>Goal</label>
              <select value={form.goal} onChange={e => update('goal', e.target.value)}>
                <option value="lose-fast">Lose Weight Fast</option>
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
                <option value="gain-fast">Build Muscle</option>
              </select>
            </div>
            <button className="btn btn-primary btn-block" onClick={saveProfile}>Save Changes</button>
          </div>
        )}
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'Calorie Calculator', path: '/calculator' },
          { label: 'Body Progress', path: '/body' },
          { label: 'Food Log', path: '/food-log' },
        ].map(link => (
          <button key={link.path} className="card card-interactive" onClick={() => navigate(link.path)}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', padding: '16px 20px' }}>
            <span className="font-semibold">{link.label}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>›</span>
          </button>
        ))}
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={item}>
        <button className="btn btn-block" onClick={resetData}
          style={{ color: 'var(--accent-danger)', border: '1px solid var(--accent-danger-light)', padding: '14px' }}>
          Reset All Data
        </button>
        <div className="text-center text-xs" style={{ color: 'var(--text-tertiary)', marginTop: '16px' }}>
          FitnessAI v1.0
        </div>
      </motion.div>
    </motion.div>
  );
}
