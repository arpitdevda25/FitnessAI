import { useEffect, useRef, useState } from 'react';

export default function ProgressRing({ size = 120, strokeWidth = 10, progress = 0, color = 'var(--accent-primary)', trackColor = 'var(--bg-secondary)', children }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(animatedProgress, 100) / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(Math.min(progress, 100)), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progress > 100 ? 'var(--accent-danger)' : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), stroke 0.3s ease' }}
        />
      </svg>
      <div className="progress-ring-content">
        {children}
      </div>
    </div>
  );
}
