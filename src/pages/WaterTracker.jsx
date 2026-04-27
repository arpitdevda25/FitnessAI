import { useState } from 'react';
import { useUser } from '../context/UserContext';
import Toast from '../components/UI/Toast';
import { motion } from 'framer-motion';

export default function WaterTracker() {
  const { todayWater, goals, dispatch } = useUser();
  const [toast, setToast] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const addWater = (ml) => {
    dispatch({ type: 'ADD_WATER', payload: ml });
    setToast({ message: `+${ml}ml added!`, type: 'success' });
  };

  const handleCustom = () => {
    const val = parseInt(customAmount);
    if (val > 0) {
      addWater(val);
      setCustomAmount('');
    }
  };

  const progress = Math.min((todayWater / goals.water) * 100, 100);
  const fillHeight = Math.min(progress, 100);
  const glasses = Math.floor(todayWater / 250);
  const remaining = Math.max(0, goals.water - todayWater);

  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div className="page-content" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <motion.div variants={item}>
        <h1 style={{ marginBottom: '4px' }}>Water Intake</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Stay hydrated throughout the day</p>
      </motion.div>

      {/* Water Visual */}
      <motion.div variants={item} className="card" style={{ marginBottom: '16px', textAlign: 'center', padding: '32px 20px' }}>
        <div className="water-glass" style={{ margin: '0 auto 24px' }}>
          <div className="water-fill" style={{ height: `${fillHeight}%` }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: fillHeight > 50 ? 'white' : 'var(--text-primary)', textShadow: fillHeight > 50 ? '0 1px 3px rgba(0,0,0,0.3)' : 'none' }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="stat-value" style={{ fontSize: '2rem' }}>{(todayWater / 1000).toFixed(1)}L</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          of {(goals.water / 1000).toFixed(1)}L goal
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
          <div>
            <div className="font-bold">{glasses}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Glasses</div>
          </div>
          <div>
            <div className="font-bold">{(remaining / 1000).toFixed(1)}L</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Remaining</div>
          </div>
          <div>
            <div className="font-bold">{todayWater}ml</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Add Buttons */}
      <motion.div variants={item} style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '12px' }}>Quick Add</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { ml: 150, label: '150ml' },
            { ml: 250, label: '250ml' },
            { ml: 500, label: '500ml' },
            { ml: 1000, label: '1L' },
          ].map(opt => (
            <button key={opt.ml} className="card card-interactive text-center" onClick={() => addWater(opt.ml)}
              style={{ cursor: 'pointer', padding: '14px 8px' }}>
              <div className="font-semibold text-sm">{opt.label}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Custom Amount */}
      <motion.div variants={item} className="card">
        <h4 style={{ marginBottom: '12px' }}>Custom Amount</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)} placeholder="Enter ml" style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={handleCustom}>Add</button>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div variants={item} className="card" style={{ marginTop: '16px', background: 'var(--accent-secondary-light)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <div className="font-semibold" style={{ marginBottom: '4px' }}>Hydration Tip</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Drink a glass of water before each meal. It helps with digestion and can reduce overeating.
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
