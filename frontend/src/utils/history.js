const HISTORY_KEY = 'deepshield_history';

export const addScan = (scan) => {
  const history = getHistory();
  const newScan = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...scan
  };
  history.unshift(newScan); // Add to beginning (newest first)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
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
