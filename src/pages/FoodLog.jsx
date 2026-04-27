import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { searchFood } from '../utils/mealAnalyzer';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import { motion } from 'framer-motion';

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast', time: '6:00 - 11:00' },
  { key: 'lunch', label: 'Lunch', time: '11:00 - 15:00' },
  { key: 'dinner', label: 'Dinner', time: '17:00 - 22:00' },
  { key: 'snack', label: 'Snacks', time: 'Anytime' },
];

export default function FoodLog() {
  const navigate = useNavigate();
  const { todayMeals, todayNutrition, goals, dispatch } = useUser();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('lunch');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAdd, setQuickAdd] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [toast, setToast] = useState(null);

  const searchResults = searchQuery.length > 1 ? searchFood(searchQuery) : [];

  const addFood = (food) => {
    dispatch({ type: 'ADD_MEAL', payload: { ...food, mealType: selectedMealType } });
    dispatch({ type: 'UPDATE_STREAK' });
    setShowSearch(false);
    setSearchQuery('');
    setToast({ message: `${food.name} added!`, type: 'success' });
  };

  const handleQuickAdd = () => {
    if (!quickAdd.name || !quickAdd.calories) return;
    dispatch({
      type: 'ADD_MEAL',
      payload: { name: quickAdd.name, calories: +quickAdd.calories, protein: +(quickAdd.protein || 0), carbs: +(quickAdd.carbs || 0), fat: +(quickAdd.fat || 0), mealType: selectedMealType },
    });
    dispatch({ type: 'UPDATE_STREAK' });
    setQuickAdd({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowQuickAdd(false);
    setToast({ message: 'Food logged!', type: 'success' });
  };

  const removeMeal = (id) => {
    dispatch({ type: 'REMOVE_MEAL', payload: id });
    setToast({ message: 'Item removed', type: 'info' });
  };

  const grouped = MEAL_TYPES.map(mt => ({
    ...mt,
    meals: todayMeals.filter(m => m.mealType === mt.key),
    totalCal: todayMeals.filter(m => m.mealType === mt.key).reduce((s, m) => s + m.calories, 0),
  }));

  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div className="page-content" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <motion.div variants={item}>
        <h1 style={{ marginBottom: '4px' }}>Food Log</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>{todayNutrition.calories} / {goals.calories} cal today</p>
      </motion.div>

      <motion.div variants={item} className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
          {[
            { label: 'Calories', val: todayNutrition.calories, goal: goals.calories, color: 'var(--calories-color)' },
            { label: 'Protein', val: todayNutrition.protein, goal: goals.protein, unit: 'g', color: 'var(--protein-color)' },
            { label: 'Carbs', val: todayNutrition.carbs, goal: goals.carbs, unit: 'g', color: 'var(--carbs-color)' },
            { label: 'Fat', val: todayNutrition.fat, goal: goals.fat, unit: 'g', color: 'var(--fat-color)' },
          ].map(n => (
            <div key={n.label}>
              <div className="font-bold" style={{ color: n.color }}>{n.val}{n.unit}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{n.label}</div>
              <div className="macro-bar-track" style={{ marginTop: '6px', height: '4px' }}>
                <div className="macro-bar-fill" style={{ width: `${Math.min((n.val / n.goal) * 100, 100)}%`, background: n.color }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {grouped.map((group) => (
        <motion.div key={group.key} variants={item} style={{ marginBottom: '16px' }}>
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3>{group.label}</h3>
              {group.totalCal > 0 && <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{group.totalCal} cal</span>}
            </div>
            <button onClick={() => { setSelectedMealType(group.key); setShowSearch(true); }} style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.2rem' }}>+</button>
          </div>
          {group.meals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {group.meals.map(meal => (
                <div key={meal.id} className="meal-card">
                  <div className="meal-card-icon" style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{meal.name.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-semibold truncate">{meal.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="text-right"><div className="font-semibold">{meal.calories}</div><div className="text-xs" style={{ color: 'var(--text-secondary)' }}>cal</div></div>
                    <button onClick={() => removeMeal(meal.id)} style={{ color: 'var(--accent-danger)', fontSize: '1.1rem', padding: '4px' }}>x</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card card-sm" style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No {group.label.toLowerCase()} logged</div>
          )}
        </motion.div>
      ))}

      <motion.div variants={item} style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button className="btn btn-primary btn-block" onClick={() => navigate('/scan')}>Scan Meal</button>
        <button className="btn btn-secondary btn-block" onClick={() => setShowQuickAdd(true)}>Quick Add</button>
      </motion.div>

      <Modal isOpen={showSearch} onClose={() => { setShowSearch(false); setSearchQuery(''); }} title="Add Food">
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search foods..." autoFocus style={{ marginBottom: '16px' }} />
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {searchResults.length > 0 ? searchResults.map((food, i) => (
            <button key={i} className="meal-card" style={{ width: '100%', marginBottom: '6px', cursor: 'pointer' }} onClick={() => addFood(food)}>
              <div className="meal-card-icon" style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{food.name.charAt(0)}</div>
              <div style={{ flex: 1, textAlign: 'left' }}><div className="font-semibold">{food.name}</div><div className="text-xs" style={{ color: 'var(--text-secondary)' }}>P:{food.protein}g C:{food.carbs}g F:{food.fat}g</div></div>
              <div className="font-semibold">{food.calories} cal</div>
            </button>
          )) : searchQuery.length > 1 ? (
            <div className="text-center" style={{ padding: '24px', color: 'var(--text-secondary)' }}>No results found</div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>Start typing to search...</div>
          )}
        </div>
      </Modal>

      <Modal isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} title="Quick Add">
        <div className="input-group"><label>Food Name</label><input type="text" value={quickAdd.name} onChange={e => setQuickAdd(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Chicken Bowl" /></div>
        <div className="input-group"><label>Calories</label><input type="number" value={quickAdd.calories} onChange={e => setQuickAdd(p => ({ ...p, calories: e.target.value }))} placeholder="e.g. 450" /></div>
        <div className="input-row" style={{ marginBottom: '20px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}><label>Protein (g)</label><input type="number" value={quickAdd.protein} onChange={e => setQuickAdd(p => ({ ...p, protein: e.target.value }))} placeholder="0" /></div>
          <div className="input-group" style={{ marginBottom: 0 }}><label>Carbs (g)</label><input type="number" value={quickAdd.carbs} onChange={e => setQuickAdd(p => ({ ...p, carbs: e.target.value }))} placeholder="0" /></div>
          <div className="input-group" style={{ marginBottom: 0 }}><label>Fat (g)</label><input type="number" value={quickAdd.fat} onChange={e => setQuickAdd(p => ({ ...p, fat: e.target.value }))} placeholder="0" /></div>
        </div>
        <button className="btn btn-primary btn-block" onClick={handleQuickAdd}>Add Food</button>
      </Modal>
    </motion.div>
  );
}
