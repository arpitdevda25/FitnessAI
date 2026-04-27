// Simulated AI meal analysis engine
// In production, replace with OpenAI Vision / Google Gemini API call

const MEAL_DATABASE = {
  breakfast: [
    { name: 'Scrambled Eggs (2)', calories: 182, protein: 12, carbs: 2, fat: 14 },
    { name: 'Toast (Whole Wheat)', calories: 130, protein: 5, carbs: 22, fat: 2 },
    { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
    { name: 'Greek Yogurt', calories: 130, protein: 17, carbs: 6, fat: 4 },
    { name: 'Oatmeal Bowl', calories: 158, protein: 6, carbs: 27, fat: 3 },
    { name: 'Avocado Toast', calories: 250, protein: 6, carbs: 26, fat: 15 },
    { name: 'Pancakes (3)', calories: 350, protein: 8, carbs: 52, fat: 12 },
    { name: 'Smoothie Bowl', calories: 280, protein: 8, carbs: 45, fat: 8 },
    { name: 'Coffee with Milk', calories: 45, protein: 2, carbs: 4, fat: 2 },
    { name: 'Orange Juice', calories: 112, protein: 2, carbs: 26, fat: 0 },
  ],
  lunch: [
    { name: 'Grilled Chicken Breast', calories: 230, protein: 43, carbs: 0, fat: 5 },
    { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 2 },
    { name: 'Caesar Salad', calories: 180, protein: 8, carbs: 12, fat: 12 },
    { name: 'Turkey Sandwich', calories: 350, protein: 24, carbs: 38, fat: 10 },
    { name: 'Pasta (Spaghetti)', calories: 380, protein: 14, carbs: 68, fat: 4 },
    { name: 'Grilled Salmon Fillet', calories: 280, protein: 34, carbs: 0, fat: 16 },
    { name: 'Mixed Vegetables', calories: 85, protein: 4, carbs: 16, fat: 1 },
    { name: 'Chicken Wrap', calories: 410, protein: 28, carbs: 42, fat: 14 },
    { name: 'Lentil Soup', calories: 230, protein: 18, carbs: 40, fat: 1 },
    { name: 'Quinoa Bowl', calories: 320, protein: 12, carbs: 52, fat: 8 },
  ],
  dinner: [
    { name: 'Steak (6oz)', calories: 360, protein: 42, carbs: 0, fat: 20 },
    { name: 'Baked Potato', calories: 160, protein: 4, carbs: 37, fat: 0 },
    { name: 'Stir-fry Vegetables', calories: 120, protein: 5, carbs: 18, fat: 4 },
    { name: 'Grilled Fish', calories: 200, protein: 36, carbs: 0, fat: 6 },
    { name: 'Chicken Curry', calories: 350, protein: 28, carbs: 18, fat: 18 },
    { name: 'Pizza Slice (2)', calories: 540, protein: 22, carbs: 60, fat: 24 },
    { name: 'Sushi Roll (8pc)', calories: 350, protein: 18, carbs: 48, fat: 8 },
    { name: 'Burrito Bowl', calories: 480, protein: 32, carbs: 52, fat: 16 },
    { name: 'Soup & Bread', calories: 280, protein: 12, carbs: 38, fat: 8 },
    { name: 'Steamed Rice', calories: 205, protein: 4, carbs: 45, fat: 0 },
  ],
  snack: [
    { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0 },
    { name: 'Almonds (1oz)', calories: 164, protein: 6, carbs: 6, fat: 14 },
    { name: 'Protein Bar', calories: 210, protein: 20, carbs: 22, fat: 8 },
    { name: 'Dark Chocolate (2 sq)', calories: 110, protein: 2, carbs: 12, fat: 7 },
    { name: 'Trail Mix', calories: 180, protein: 5, carbs: 18, fat: 10 },
    { name: 'Cheese & Crackers', calories: 200, protein: 8, carbs: 16, fat: 12 },
    { name: 'Hummus & Veggies', calories: 150, protein: 6, carbs: 16, fat: 7 },
    { name: 'Fruit Smoothie', calories: 200, protein: 4, carbs: 42, fat: 2 },
    { name: 'Rice Cakes (2)', calories: 70, protein: 2, carbs: 14, fat: 1 },
    { name: 'Mixed Berries', calories: 85, protein: 1, carbs: 20, fat: 1 },
  ],
};

function getRandomItems(array, min, max) {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getMealType() {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 18) return 'snack';
  return 'dinner';
}

export function analyzeMeal(imageData) {
  return new Promise((resolve) => {
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const mealType = getMealType();
      const foods = MEAL_DATABASE[mealType] || MEAL_DATABASE.lunch;
      const detected = getRandomItems(foods, 2, 4);

      const items = detected.map(food => ({
        ...food,
        confidence: 0.82 + Math.random() * 0.16,
        servings: 1,
      }));

      const totals = items.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      resolve({
        success: true,
        mealType,
        items,
        totals,
        timestamp: new Date().toISOString(),
      });
    }, delay);
  });
}

export function searchFood(query) {
  const allFoods = Object.values(MEAL_DATABASE).flat();
  const q = query.toLowerCase();
  return allFoods.filter(f => f.name.toLowerCase().includes(q));
}

export { MEAL_DATABASE };
