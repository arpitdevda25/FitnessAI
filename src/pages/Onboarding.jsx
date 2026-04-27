import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 'welcome', title: 'Welcome to FitnessAI', subtitle: 'Your AI-powered fitness companion' },
  { id: 'name', title: "What's your name?", subtitle: "Let's personalize your experience" },
  { id: 'gender', title: 'Select your gender', subtitle: 'This helps us calculate your needs' },
  { id: 'metrics', title: 'Your body metrics', subtitle: 'We need this for accurate calculations' },
  { id: 'activity', title: 'Activity level', subtitle: 'How active are you on a daily basis?' },
  { id: 'goal', title: "What's your goal?", subtitle: "We'll customize your plan" },
];

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
  { value: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { value: 'active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { value: 'very-active', label: 'Extra Active', desc: 'Very hard exercise & physical job' },
];

const goalOptions = [
  { value: 'lose-fast', label: 'Lose Weight Fast', desc: '-750 cal/day deficit' },
  { value: 'lose', label: 'Lose Weight', desc: '-500 cal/day deficit' },
  { value: 'maintain', label: 'Maintain Weight', desc: 'Stay at current weight' },
  { value: 'gain', label: 'Gain Weight', desc: '+300 cal/day surplus' },
  { value: 'gain-fast', label: 'Build Muscle', desc: '+500 cal/day surplus' },
];

export default function Onboarding() {
  const { dispatch } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    gender: 'male',
    age: 25,
    height: 175,
    weight: 70,
    activityLevel: 'moderate',
    goal: 'maintain',
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      dispatch({ type: 'SET_PROFILE', payload: { ...form, onboarded: true } });
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      navigate('/');
    }
  };

  const canProceed = () => {
    if (step === 1) return form.name.trim().length > 0;
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '12px' }}>FitnessAI</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '280px', lineHeight: 1.6 }}>
              Track calories with AI, count steps, monitor progress, and achieve your fitness goals.
            </p>
          </div>
        );
      case 1:
        return (
          <div style={{ marginTop: '40px' }}>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              style={{ fontSize: '1.2rem', padding: '16px 20px', textAlign: 'center' }}
              autoFocus
              id="onboarding-name"
            />
          </div>
        );
      case 2:
        return (
          <div className="onboarding-options">
            {[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ].map(opt => (
              <button
                key={opt.value}
                className={`option-card ${form.gender === opt.value ? 'selected' : ''}`}
                onClick={() => update('gender', opt.value)}
              >
                <span style={{ fontWeight: 600 }}>{opt.label}</span>
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="input-group">
              <label>Age</label>
              <input type="number" value={form.age} onChange={e => update('age', +e.target.value)} min={10} max={100} id="onboarding-age" />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Height (cm)</label>
                <input type="number" value={form.height} onChange={e => update('height', +e.target.value)} min={100} max={250} id="onboarding-height" />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input type="number" value={form.weight} onChange={e => update('weight', +e.target.value)} min={30} max={300} id="onboarding-weight" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="onboarding-options">
            {activityOptions.map(opt => (
              <button
                key={opt.value}
                className={`option-card ${form.activityLevel === opt.value ? 'selected' : ''}`}
                onClick={() => update('activityLevel', opt.value)}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{opt.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="onboarding-options">
            {goalOptions.map(opt => (
              <button
                key={opt.value}
                className={`option-card ${form.goal === opt.value ? 'selected' : ''}`}
                onClick={() => update('goal', opt.value)}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{opt.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-progress">
        {steps.map((_, i) => (
          <div key={i} className={`onboarding-dot ${i <= step ? 'active' : ''}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="onboarding-content"
        >
          {step > 0 && (
            <>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{steps[step].title}</h1>
              <p style={{ color: 'var(--text-secondary)' }}>{steps[step].subtitle}</p>
            </>
          )}
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', gap: '12px' }}>
        {step > 0 && (
          <button
            className="btn btn-secondary"
            onClick={() => setStep(step - 1)}
            style={{ flex: '0 0 auto', padding: '14px 24px' }}
          >
            Back
          </button>
        )}
        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={next}
          disabled={!canProceed()}
          style={{ opacity: canProceed() ? 1 : 0.4 }}
          id="onboarding-next"
        >
          {step === steps.length - 1 ? "Let's Go" : 'Continue'}
        </button>
      </div>
    </div>
  );
}
