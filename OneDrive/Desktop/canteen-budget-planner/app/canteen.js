/* Shared canteen data. Class times come from the IIUC schedule.
   Crowd levels are SAMPLE numbers: replace with real counts. */
export const toMin = (h, m = 0) => h * 60 + m;
export const FIRST_HOUR = 8; // crowd arrays cover 8 AM to 4 PM, one value per hour

export const CLASS = {
  female: [toMin(8, 20), toMin(13, 20)],
  male: [toMin(10), toMin(16)],
};

// Canteens open a little before the first class and close a little after the last one.
const hoursFor = (gender, before, after) => [[CLASS[gender][0] - before, CLASS[gender][1] + after]];

export const CANTEENS = [
  {
    id: 'main',
    name: 'Main canteen',
    sections: {
      female: { hours: hoursFor('female', 20, 40), crowd: [35, 50, 60, 75, 90, 55, 10, 0, 0] },
      male: { hours: hoursFor('male', 20, 40), crowd: [0, 15, 35, 50, 70, 95, 80, 50, 30] },
    },
  },
  {
    id: 'cafe',
    name: 'Cafeteria',
    sections: {
      female: { hours: hoursFor('female', 0, 0), crowd: [25, 40, 50, 65, 80, 45, 0, 0, 0] },
      male: { hours: hoursFor('male', 0, 0), crowd: [0, 0, 30, 45, 60, 85, 65, 40, 20] },
    },
  },
];

export const fmt = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
export const hourLabel = (h) => `${((h + 11) % 12) + 1}${h >= 12 ? 'p' : 'a'}`;
export const openDuring = (hours, h) => hours.some(([a, b]) => a < (h + 1) * 60 && b > h * 60);
export const levelOf = (c) =>
  c < 40
    ? { label: 'Quiet', bar: 'bg-[#2F6B4F]', wait: Math.max(2, Math.round(c / 10)) }
    : c < 70
    ? { label: 'Busy', bar: 'bg-[#F4C95D]', wait: Math.round(c / 8) }
    : { label: 'Packed', bar: 'bg-[#F2674A]', wait: Math.round(c / 6) };

export function getStatus(hours, t) {
  for (const [a, b] of hours) if (t >= a && t < b) return { open: true, until: b };
  const next = hours.find(([a]) => a > t);
  return { open: false, next: next ? next[0] : null };
}

// Quietest open hour from `t` onward, or null if the canteen is done for today.
export function quietestHour(sec, t) {
  const hour = Math.floor(t / 60);
  return (
    sec.crowd
      .map((c, i) => ({ h: FIRST_HOUR + i, c }))
      .filter((x) => x.h >= hour && openDuring(sec.hours, x.h))
      .sort((a, b) => a.c - b.c)[0] || null
  );
}
