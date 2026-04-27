import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return createPortal(
    <div className="toast-container" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-20px)', transition: 'all 0.3s ease' }}>
      <div className="toast">
        <span>{message}</span>
      </div>
    </div>,
    document.body
  );
}
