export const loadTablesFromStorage = (key = 'restaurant_tables') => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('loadTablesFromStorage error', e);
    return null;
  }
};

export const saveTablesToStorage = (tables, key = 'restaurant_tables') => {
  try {
    localStorage.setItem(key, JSON.stringify(tables));
  } catch (e) {
    console.error('saveTablesToStorage error', e);
  }
};
