import { useState, useRef } from 'react';
import { useUser } from '../context/UserContext';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import { motion } from 'framer-motion';

export default function BodyComparison() {
  const { bodyPhotos, measurements, dispatch } = useUser();
  const [photoType, setPhotoType] = useState('front');
  const [toast, setToast] = useState(null);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const fileRef = useRef(null);
  const sliderRef = useRef(null);
  const [measureForm, setMeasureForm] = useState({ chest: '', waist: '', hips: '', arms: '', thighs: '' });

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      dispatch({ type: 'ADD_BODY_PHOTO', payload: { imageData: ev.target.result, type: photoType } });
      setToast({ message: 'Progress photo saved!', type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handleSliderMove = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPos(Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100)));
  };

  const saveMeasurements = () => {
    const data = {};
    Object.keys(measureForm).forEach(k => { data[k] = +measureForm[k] || 0; });
    dispatch({ type: 'LOG_MEASUREMENTS', payload: data });
    setShowMeasurements(false);
    setToast({ message: 'Measurements saved!', type: 'success' });
  };

  const photos = bodyPhotos.filter(p => p.type === photoType).sort((a, b) => new Date(b.date) - new Date(a.date));
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div className="page-content" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <input type="file" accept="image/*" capture="user" ref={fileRef} style={{ display: 'none' }} onChange={handlePhotoCapture} />

      <motion.div variants={item}>
        <h1 style={{ marginBottom: '4px' }}>Body Progress</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Track your visual transformation</p>
      </motion.div>

      <motion.div variants={item} style={{ marginBottom: '16px' }}>
        <div className="tabs" style={{ marginBottom: '16px' }}>
          {['front', 'side', 'back'].map(t => (
            <button key={t} className={`tab ${photoType === t ? 'active' : ''}`} onClick={() => setPhotoType(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-block" onClick={() => fileRef.current?.click()}>
          Take {photoType} Photo
        </button>
      </motion.div>

      {photos.length >= 2 && (
        <motion.div variants={item} className="card" style={{ marginBottom: '16px' }}>
          <h4 style={{ marginBottom: '12px' }}>Before & After</h4>
          <div className="comparison-slider" ref={sliderRef}
            onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)} onTouchMove={handleSliderMove}>
            <img src={photos[0].imageData} alt="After" />
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: `${sliderPos}%` }}>
              <img src={photos[photos.length - 1].imageData} alt="Before" style={{ width: sliderRef.current?.offsetWidth || '100%' }} />
            </div>
            <div className="comparison-divider" style={{ left: `${sliderPos}%` }}>
              <div className="comparison-handle"><span style={{ fontSize: '0.8rem' }}>↔</span></div>
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>Before</div>
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>After</div>
          </div>
        </motion.div>
      )}

      <motion.div variants={item} style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '12px' }}>Timeline</h3>
        {photos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {photos.map(p => (
              <div key={p.id} style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img src={p.imageData} alt="progress" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: '#fff', fontSize: '0.65rem', fontWeight: 600 }}>
                  {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <h3>No photos yet</h3>
            <p>Take your first photo to start tracking</p>
          </div>
        )}
      </motion.div>

      <motion.div variants={item}>
        <div className="section-header">
          <h3>Measurements</h3>
          <button onClick={() => setShowMeasurements(true)} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>+ Log</button>
        </div>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
            {['Chest', 'Waist', 'Hips', 'Arms', 'Thighs'].map(m => {
              const latest = Object.values(measurements).pop();
              return (
                <div key={m}>
                  <div className="font-bold">{latest?.[m.toLowerCase()] || '--'}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <Modal isOpen={showMeasurements} onClose={() => setShowMeasurements(false)} title="Log Measurements (cm)">
        {Object.keys(measureForm).map(k => (
          <div className="input-group" key={k}>
            <label>{k}</label>
            <input type="number" value={measureForm[k]} onChange={e => setMeasureForm(p => ({ ...p, [k]: e.target.value }))} placeholder="cm" />
          </div>
        ))}
        <button className="btn btn-primary btn-block" onClick={saveMeasurements}>Save</button>
      </Modal>
    </motion.div>
  );
}
