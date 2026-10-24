// "My week" lives in the browser (localStorage). Every call is guarded: storage can be blocked.
const KEY = 'eatsmart-week-v1';

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function loadWeek() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (d) return { budget: Number(d.budget) || 500, entries: Array.isArray(d.entries) ? d.entries : [] };
  } catch {}
  return { budget: 500, entries: [] };
}

export function saveWeek(week) {
  try {
    localStorage.setItem(KEY, JSON.stringify(week));
  } catch {}
}

export function addEntry(name, total) {
  const week = loadWeek();
  week.entries.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: dayKey(), name, total });
  saveWeek(week);
}
