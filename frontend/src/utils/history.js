const HISTORY_KEY = 'deepshield_history';

export const addScan = (scan) => {
  const history = getHistory();
  const newScan = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...scan,
    imagePreview: scan.imagePreview?.startsWith('data:') 
      ? null
      : scan.imagePreview
  };
  history.unshift(newScan);
  const trimmed = history.slice(0, 20);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([newScan]));
  }
};

export const getHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const deleteScan = (id) => {
  const history = getHistory();
  const newHistory = history.filter(scan => scan.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
};