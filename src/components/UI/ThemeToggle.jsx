import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ showLabel = true }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {showLabel && (
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
      <button
        className={`toggle-switch ${isDark ? 'active' : ''}`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
        id="theme-toggle"
      />
    </div>
  );
}
