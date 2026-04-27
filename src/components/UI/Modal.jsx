export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        {title && <h3 style={{ marginBottom: '20px' }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}
