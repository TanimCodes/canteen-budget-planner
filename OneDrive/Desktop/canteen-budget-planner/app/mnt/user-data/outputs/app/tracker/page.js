'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteNav from '../SiteNav';
import { display, body, focus } from '../lib/ui';
import { dayKey, loadWeek, saveWeek } from '../lib/week';

const DAYS = 7;

function lastDays() {
  const out = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({ key: dayKey(d), label: d.toLocaleDateString('en-GB', { weekday: 'short' }), today: i === 0 });
  }
  return out;
}

export default function Tracker() {
  const [week, setWeek] = useState(null); // null until the browser's saved data is read
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => setWeek(loadWeek()), []);

  const update = (next) => {
    setWeek(next);
    saveWeek(next);
  };

  if (!week) {
    return (
      <main className={`${body.className} min-h-screen bg-[#F6F0E4] text-[#23201B]`}>
        <SiteNav />
      </main>
    );
  }

  const days = lastDays();
  const inWeek = week.entries.filter((e) => days.some((d) => d.key === e.date));
  const spent = inWeek.reduce((s, e) => s + e.total, 0);
  const left = week.budget - spent;
  const pct = week.budget > 0 ? Math.min(100, (spent / week.budget) * 100) : 0;
  const perDay = days.map((d) => ({ ...d, total: inWeek.filter((e) => e.date === d.key).reduce((s, e) => s + e.total, 0) }));
  const maxDay = Math.max(week.budget / DAYS, ...perDay.map((d) => d.total), 1);

  const addManual = (e) => {
    e.preventDefault();
    const n = name.trim();
    const p = Number(price);
    if (!n || !Number.isFinite(p) || p <= 0) return;
    update({ ...week, entries: [...week.entries, { id: `${Date.now()}`, date: dayKey(), name: n, total: Math.round(p) }] });
    setName('');
    setPrice('');
  };

  return (
    <main className={`${body.className} min-h-screen bg-[#F6F0E4] text-[#23201B]`}>
      <SiteNav />
      <div className="max-w-5xl mx-auto px-5 pt-8 pb-20">
        <h1 className={`${display.className} font-extrabold tracking-tight text-4xl md:text-6xl leading-[1.05] max-w-2xl`}>
          My week of meals
        </h1>
        <p className="mt-4 text-lg text-[#23201B]/70 max-w-xl leading-relaxed">
          Meals you save from the planner show up here. Your data stays in this browser.
        </p>

        <div className="mt-12 grid md:grid-cols-5 gap-8 items-start">
          {/* LEFT: budget and chart */}
          <div className="md:col-span-3 space-y-6">
            <div className="rounded-3xl bg-white p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <label htmlFor="wk" className="font-semibold">Budget for the last 7 days</label>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#23201B]/60">৳</span>
                  <input
                    id="wk"
                    type="number"
                    min={0}
                    value={week.budget}
                    onChange={(e) => update({ ...week, budget: Math.max(0, Number(e.target.value) || 0) })}
                    className={`${display.className} w-28 text-right text-3xl font-extrabold text-[#F2674A] bg-transparent border-b-2 border-[#23201B]/20 focus:border-[#F2674A] ${focus}`}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <p className={`${display.className} text-4xl font-extrabold tabular-nums`}>৳{spent}</p>
                <p className={`font-semibold tabular-nums ${left < 0 ? 'text-[#d9533a]' : 'text-[#2F6B4F]'}`}>
                  {left < 0 ? `৳${-left} over budget` : `৳${left} left`}
                </p>
              </div>
              <div
                className="mt-3 h-4 rounded-full bg-[#23201B]/10 overflow-hidden"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={week.budget}
                aria-valuenow={Math.min(spent, week.budget)}
                aria-label="Spent so far"
              >
                <div style={{ width: `${pct}%` }} className={`h-full rounded-full ${left < 0 ? 'bg-[#F2674A]' : 'bg-[#2F6B4F]'}`} />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-7">
              <h2 className="font-bold text-lg">Spending by day</h2>
              <div
                role="img"
                aria-label={`Spending per day: ${perDay.map((d) => `${d.label} ৳${d.total}`).join(', ')}`}
                className="mt-5 flex gap-2"
              >
                {perDay.map((d) => (
                  <div key={d.key} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs tabular-nums text-[#23201B]/70 h-4">{d.total > 0 ? `৳${d.total}` : ''}</span>
                    <div className="h-32 w-full flex items-end">
                      <div
                        style={{ height: d.total > 0 ? `${Math.max(6, (d.total / maxDay) * 100)}%` : '4%' }}
                        className={`w-full rounded-t-lg ${d.total > 0 ? 'bg-[#F2674A]' : 'bg-[#23201B]/15'} ${d.today ? 'ring-2 ring-[#23201B] ring-offset-2 ring-offset-white' : ''}`}
                      />
                    </div>
                    <span className="text-xs text-[#23201B]/70">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: add + list */}
          <div className="md:col-span-2 space-y-6">
            <form onSubmit={addManual} className="rounded-3xl bg-white p-7 space-y-4">
              <h2 className="font-bold text-lg">Add a meal</h2>
              <div>
                <label htmlFor="mn" className="text-sm font-medium">What did you eat?</label>
                <input id="mn" value={name} onChange={(e) => setName(e.target.value)} placeholder="Khichuri and egg" className={`mt-1 w-full rounded-xl border-2 border-[#23201B]/20 px-4 py-2.5 ${focus}`} />
              </div>
              <div>
                <label htmlFor="mp" className="text-sm font-medium">Cost (৳)</label>
                <input id="mp" type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="50" className={`mt-1 w-full rounded-xl border-2 border-[#23201B]/20 px-4 py-2.5 ${focus}`} />
              </div>
              <button type="submit" className={`w-full rounded-full bg-[#23201B] text-[#F6F0E4] font-semibold py-2.5 hover:bg-[#F2674A] transition-colors ${focus}`}>
                Add meal
              </button>
            </form>

            <div className="rounded-3xl bg-white p-7">
              <h2 className="font-bold text-lg">This week’s meals</h2>
              {inWeek.length === 0 ? (
                <div className="mt-4 text-center py-4">
                  <p className="text-[#23201B]/70">No meals yet. Plan one and save it here.</p>
                  <Link href="/planner" className={`mt-4 inline-block rounded-full bg-[#F2674A] text-white font-semibold px-6 py-2.5 hover:bg-[#d9533a] transition-colors ${focus}`}>
                    Open the planner
                  </Link>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-[#23201B]/10">
                  {[...inWeek].reverse().map((e) => (
                    <li key={e.id} className="flex items-center gap-3 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{e.name}</p>
                        <p className="text-xs text-[#23201B]/60">{e.date}</p>
                      </div>
                      <span className="tabular-nums font-semibold">৳{e.total}</span>
                      <button
                        onClick={() => update({ ...week, entries: week.entries.filter((x) => x.id !== e.id) })}
                        aria-label={`Remove ${e.name}`}
                        className={`rounded-full w-8 h-8 text-lg leading-none hover:bg-[#23201B]/10 ${focus}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
