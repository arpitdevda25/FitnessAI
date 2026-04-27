import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { analyzeMeal } from '../utils/mealAnalyzer';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/UI/Toast';

export default function MealScanner() {
  const navigate = useNavigate();
  const { dispatch } = useUser();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [phase, setPhase] = useState('camera');
  const [capturedImage, setCapturedImage] = useState(null);
  const [results, setResults] = useState(null);
  const [toast, setToast] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) videoRef.current.srcObject = s;
      setStream(s);
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [facingMode]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    if (stream) stream.getTracks().forEach(t => t.stop());
    setPhase('analyzing');
    analyzeMeal(imageData).then(result => { setResults(result); setPhase('results'); });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCapturedImage(ev.target.result);
      if (stream) stream.getTracks().forEach(t => t.stop());
      setPhase('analyzing');
      analyzeMeal(ev.target.result).then(result => { setResults(result); setPhase('results'); });
    };
    reader.readAsDataURL(file);
  };

  const saveMeal = () => {
    if (!results) return;
    results.items.forEach(item => {
      dispatch({
        type: 'ADD_MEAL',
        payload: {
          name: item.name,
          calories: Math.round(item.calories * item.servings),
          protein: Math.round(item.protein * item.servings),
          carbs: Math.round(item.carbs * item.servings),
          fat: Math.round(item.fat * item.servings),
          mealType: results.mealType,
        },
      });
    });
    dispatch({ type: 'UPDATE_STREAK' });
    setToast({ message: 'Meal logged successfully!', type: 'success' });
    setTimeout(() => navigate('/'), 1500);
  };

  const retake = () => { setCapturedImage(null); setResults(null); setPhase('camera'); startCamera(); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#000' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <AnimatePresence mode="wait">
        {phase === 'camera' && (
          <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '16px 20px', background: 'linear-gradient(rgba(0,0,0,0.6), transparent)' }}>
              <button onClick={() => navigate(-1)} style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>Close</button>
              <button onClick={() => setFacingMode(f => f === 'environment' ? 'user' : 'environment')} style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>Flip</button>
            </div>
            <video ref={videoRef} autoPlay playsInline muted style={{ flex: 1, objectFit: 'cover', width: '100%' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ width: '75%', aspectRatio: '1', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTop: '3px solid white', borderLeft: '3px solid white', borderRadius: '10px 0 0 0' }} />
                <div style={{ position: 'absolute', top: -2, right: -2, width: 30, height: 30, borderTop: '3px solid white', borderRight: '3px solid white', borderRadius: '0 10px 0 0' }} />
                <div style={{ position: 'absolute', bottom: -2, left: -2, width: 30, height: 30, borderBottom: '3px solid white', borderLeft: '3px solid white', borderRadius: '0 0 0 10px' }} />
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderBottom: '3px solid white', borderRight: '3px solid white', borderRadius: '0 0 10px 0' }} />
              </div>
            </div>
            <div className="camera-overlay">
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>Point camera at your meal</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <label style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
                <button className="capture-btn" onClick={capturePhoto} id="capture-btn" aria-label="Capture" />
                <div style={{ width: 44 }} />
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            {capturedImage && <img src={capturedImage} alt="Captured meal" style={{ width: '100%', height: '50vh', objectFit: 'cover' }} />}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '20px' }}>
              <div style={{ width: 60, height: 60, border: '3px solid var(--accent-primary)', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div>
                <h3 style={{ textAlign: 'center', marginBottom: '8px' }}>Analyzing your meal...</h3>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>AI is identifying food items and calculating nutrition</p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'results' && results && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflowY: 'auto' }}>
            {capturedImage && (
              <div style={{ position: 'relative' }}>
                <img src={capturedImage} alt="Meal" style={{ width: '100%', height: '35vh', objectFit: 'cover' }} />
                <button onClick={retake} style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.85rem' }}>Retake</button>
              </div>
            )}
            <div style={{ flex: 1, padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
                {[
                  { label: 'Calories', value: results.totals.calories, unit: 'kcal', color: 'var(--calories-color)' },
                  { label: 'Protein', value: results.totals.protein, unit: 'g', color: 'var(--protein-color)' },
                  { label: 'Carbs', value: results.totals.carbs, unit: 'g', color: 'var(--carbs-color)' },
                  { label: 'Fat', value: results.totals.fat, unit: 'g', color: 'var(--fat-color)' },
                ].map(n => (
                  <div key={n.label} className="card card-sm text-center">
                    <div className="text-number" style={{ fontSize: '1.2rem', color: n.color }}>{n.value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{n.unit}</div>
                    <div className="text-xs font-medium" style={{ marginTop: '4px' }}>{n.label}</div>
                  </div>
                ))}
              </div>
              <h3 style={{ marginBottom: '14px' }}>Detected Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {results.items.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="meal-card">
                    <div className="meal-card-icon" style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{item.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{Math.round(item.confidence * 100)}% confidence</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.calories}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>cal</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary btn-block" onClick={retake}>Retake</button>
                <button className="btn btn-primary btn-block" onClick={saveMeal} id="save-meal-btn">Log Meal</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
