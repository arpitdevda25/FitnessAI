import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/UI/ThemeToggle';

export default function Landing() {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="landing-logo">
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
          </div>
          FitnessAI
        </div>
        <ThemeToggle showLabel={false} />
      </nav>

      <motion.div className="landing-hero" variants={container} initial="hidden" animate="show">
        <motion.div className="landing-floating-element" style={{ top: '15%', left: '10%' }}
          initial={{ y: 0 }} animate={{ y: [-15, 15, -15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>1,850</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>KCAL LEFT</div>
            </div>
          </div>
        </motion.div>

        <motion.div className="landing-floating-element" style={{ top: '25%', right: '8%' }}
          initial={{ y: 0 }} animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', color: 'var(--steps-color)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800 }}>8,432</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>STEPS</div>
            </div>
          </div>
        </motion.div>

        <motion.h1 className="hero-title" variants={item}>
          The smartest way to build your perfect body.
        </motion.h1>
        
        <motion.p className="hero-subtitle" variants={item}>
          Artificial intelligence meets behavioral science. Scan your meals instantly, track macros effortlessly, and execute your physical transformation with precision.
        </motion.p>
        
        <motion.div variants={item}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/onboarding')} 
            style={{ padding: '20px 48px', fontSize: '1.1rem', borderRadius: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            Start Tracking Free
          </button>
        </motion.div>
      </motion.div>

      <div className="landing-features">
        <motion.div className="features-grid" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={container}>
          {[
            {
              title: "AI Meal Scanning",
              desc: "Don't search for foods. Just snap a photo. Our vision AI instantly detects ingredients and calculates precise calories and macros.",
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            },
            {
              title: "Precision Analytics",
              desc: "Correlate your caloric intake with your energy expenditure. Predict your weight trajectory based on exact metabolic math.",
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            },
            {
              title: "Body Recomposition",
              desc: "Compare your before and after photos seamlessly with guided overlays. See the physical results of your daily habits.",
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            }
          ].map((feat, i) => (
            <motion.div key={i} className="feature-card" variants={item}>
              <div className="feature-icon-wrapper" style={{ color: 'var(--accent-primary)' }}>
                {feat.icon}
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.4rem' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
