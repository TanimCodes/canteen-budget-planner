'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteNav from '../SiteNav';
import { display, hand, body, focus, RECEIPT_EDGE } from '../lib/ui';
import { CANTEENS, FIRST_HOUR, fmt, getStatus, levelOf, quietestHour } from '../lib/canteen';
import { addEntry } from '../lib/week';

const MENU = [
  { name: 'Rice', price: 20 },
  { name: 'Chicken', price: 50 },
  { name: 'Egg', price: 15 },
  { name: 'Veg', price: 20 },
];
const MIN_BUDGET = Math.min(...MENU.map((m) => m.price));
const PREFERENCES = ['High Protein', 'Vegetarian', 'Low Calorie'];
const PRESETS = [
  { label: 'Tight budget', budget: 50, pref: 'Low Calorie' },
  { label: 'Gym day', budget: 100, pref: 'High Protein' },
  { label: 'Veggie day', budget: 60, pref: 'Vegetarian' },
];

const ERRORS = {
  unreachable: { title: 'Can’t reach the local AI', fix: 'Start Ollama (run “ollama serve”), then try again.' },
  model_missing: { title: 'The AI model isn’t installed', fix: 'Run “ollama pull gemma4:e2b” (or set OLLAMA_MODEL to a model you have), then try again.' },
  timeout: { title: 'The AI took too long to answer', fix: 'Check that Ollama is running and not busy, then try again.' },
  parse: { title: 'The AI’s answer wasn’t readable', fix: 'Tap “Suggest meal” again to get a fresh answer.' },
  empty: { title: 'The AI didn’t pick anything from the menu', fix: 'This happens sometimes with small models. Tap “Suggest meal” again.' },
  other: { title: 'Something went wrong', fix: 'Try again in a moment.' },
};

/* Don't trust the model's arithmetic: match its items to the real menu and recalculate. */
function verify(raw, budget) {
  const items = (Array.isArray(raw?.items) ? raw.items : []).map(String);
  const lines = [];
  let unknown = 0;
  for (const it of items) {
    const hit = MENU.find((m) => it.toLowerCase().includes(m.name.toLowerCase()));
    if (hit) lines.push(hit);
    else unknown += 1;
  }
  const total = lines.reduce((s, m) => s + m.price, 0);
  return {
    meal: String(raw?.recommended_meal || 'Suggested meal'),
    reason: String(raw?.reason || ''),
    lines,
    total,
    unknown,
    recalculated: Number(raw?.total_cost) !== total,
    over: total > budget ? total - budget : 0,
  };
}

export default function Planner() {
  const [budget, setBudget] = useState(70);
  const [preference, setPreference] = useState('High Protein');
  const [canteenId, setCanteenId] = useState('main');
  const [gender, setGender] = useState('male');
  const [now, setNow] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const reqId = useRef(0);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  const budgetOk = Number.isFinite(budget) && budget >= MIN_BUDGET;
  const canteen = CANTEENS.find((c) => c.id === canteenId);
  const sec = canteen.sections[gender];
  const st = now === null ? null : getStatus(sec.hours, now);
  const level = st?.open ? levelOf(sec.crowd[Math.floor(now / 60) - FIRST_HOUR] ?? 0) : null;
  const quiet = now === null ? null : quietestHour(sec, now);

  const generate = async () => {
    if (!budgetOk) return;
    const id = ++reqId.current; // ignore answers from older requests
    setLoading(true);
    setResult(null);
    setError(null);
    setSaved(false);

    const menuText = MENU.map((m) => `${m.name} ${m.price} BDT`).join(', ');
    const prompt = `You are a canteen assistant. Menu: ${menuText}. Budget is ${budget} BDT and the user wants ${preference}. Use only items from the menu and never go over the budget. Output your answer ONLY in strict JSON format with keys: "recommended_meal", "items" (array of menu item names), "total_cost" (number), "reason".`;

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json().catch(() => ({}));
      if (id !== reqId.current) return;
      if (!res.ok) {
        setError(ERRORS[data.error] || ERRORS.other);
        return;
      }
      let parsed;
      try {
        parsed = JSON.parse(data.response);
      } catch {
        setError(ERRORS.parse);
        return;
      }
      const checked = verify(parsed, budget);
      if (checked.lines.length === 0) setError(ERRORS.empty);
      else setResult(checked);
    } catch {
      if (id === reqId.current) setError(ERRORS.other);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  };

  const copyPlan = async () => {
    if (!result) return;
    const text = `${result.meal}: ${result.lines.map((m) => `${m.name} ৳${m.price}`).join(', ')}. Total ৳${result.total} of ৳${budget}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const saveToWeek = () => {
    if (!result || saved) return;
    addEntry(result.meal, result.total);
    setSaved(true);
  };

  const chip = (active) =>
    `rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${focus} ${
      active ? 'bg-[#23201B] text-[#F6F0E4] border-[#23201B]' : 'border-[#23201B]/25 hover:border-[#23201B]'
    }`;

  return (
    <main className={`${body.className} min-h-screen bg-[#F6F0E4] text-[#23201B]`}>
      <SiteNav />

      <div className="max-w-5xl mx-auto px-5 pt-8 pb-20">
        <h1 className={`${display.className} font-extrabold tracking-tight text-4xl md:text-6xl leading-[1.05] max-w-2xl`}>
          What should I eat today?
        </h1>
        <p className="mt-4 text-lg text-[#23201B]/70 max-w-xl leading-relaxed">
          Set your budget and what you’re after. The AI picks from today’s canteen menu, and we check it against the canteen’s hours.
        </p>

        <div className="mt-12 grid md:grid-cols-5 gap-8 items-start">
          {/* FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              generate();
            }}
            className="md:col-span-2 rounded-3xl bg-white p-7 space-y-7"
          >
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="budget" className="font-semibold">Budget</label>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#23201B]/60">৳</span>
                  <input
                    aria-label="Budget in taka"
                    type="number"
                    min={MIN_BUDGET}
                    value={Number.isFinite(budget) ? budget : ''}
                    onChange={(e) => setBudget(e.target.value === '' ? NaN : Number(e.target.value))}
                    className={`${display.className} w-20 text-right text-3xl font-extrabold text-[#F2674A] bg-transparent border-b-2 border-[#23201B]/20 focus:border-[#F2674A] ${focus}`}
                  />
                </div>
              </div>
              <input
                id="budget"
                type="range"
                min={MIN_BUDGET}
                max={200}
                step={5}
                value={Number.isFinite(budget) ? Math.min(budget, 200) : MIN_BUDGET}
                onChange={(e) => setBudget(Number(e.target.value))}
                className={`w-full mt-4 accent-[#F2674A] ${focus}`}
              />
              {!budgetOk && (
                <p role="alert" className="mt-2 text-sm text-[#d9533a]">
                  The cheapest item costs ৳{MIN_BUDGET}. Enter ৳{MIN_BUDGET} or more.
                </p>
              )}
            </div>

            <div role="group" aria-label="Preference">
              <p className="font-semibold mb-3">I want</p>
              <div className="flex flex-wrap gap-2">
                {PREFERENCES.map((p) => (
                  <button key={p} type="button" aria-pressed={preference === p} onClick={() => setPreference(p)} className={chip(preference === p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold mb-3">Quick start</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setBudget(p.budget);
                      setPreference(p.pref);
                    }}
                    className={`rounded-xl bg-[#F6F0E4] px-4 py-2 text-sm font-medium hover:bg-[#F4C95D] transition-colors ${focus}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Where are you eating? */}
            <div className="border-t border-dashed border-[#23201B]/25 pt-6 space-y-4">
              <p className="font-semibold">Where are you eating?</p>
              <div role="group" aria-label="Section" className="flex gap-2">
                <button type="button" aria-pressed={gender === 'male'} onClick={() => setGender('male')} className={chip(gender === 'male')}>Male section</button>
                <button type="button" aria-pressed={gender === 'female'} onClick={() => setGender('female')} className={chip(gender === 'female')}>Female section</button>
              </div>
              <div role="group" aria-label="Canteen" className="flex flex-wrap gap-2">
                {CANTEENS.map((c) => (
                  <button key={c.id} type="button" aria-pressed={canteenId === c.id} onClick={() => setCanteenId(c.id)} className={chip(canteenId === c.id)}>
                    {c.name}
                  </button>
                ))}
              </div>
              <div className={`rounded-2xl px-4 py-3 text-sm ${st?.open ? 'bg-[#2F6B4F] text-[#F6F0E4]' : 'bg-[#23201B] text-[#F6F0E4]'}`}>
                {st === null ? (
                  'Checking the time…'
                ) : st.open ? (
                  <>
                    <span className="font-bold">Open until {fmt(st.until)}.</span>{' '}
                    {level && `${level.label}, about ${level.wait} min in the queue.`}
                  </>
                ) : (
                  <span className="font-bold">
                    {st.next ? `Closed now. Reopens at ${fmt(st.next)}.` : 'Closed for today.'}
                  </span>
                )}
                {st?.open && quiet && level && level.label !== 'Quiet' && (
                  <span className="block mt-1 opacity-85">Quieter at {fmt(quiet.h * 60)}.</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !budgetOk}
              className={`w-full rounded-full bg-[#F2674A] text-white font-bold text-lg py-3.5 hover:bg-[#d9533a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focus}`}
            >
              {loading ? 'Picking your meal…' : 'Suggest meal'}
            </button>

            <div className="border-t border-dashed border-[#23201B]/25 pt-5">
              <p className="text-sm font-semibold mb-2">Today’s menu</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#23201B]/70">
                {MENU.map((m) => (
                  <li key={m.name}>
                    {m.name} <span className="tabular-nums font-semibold text-[#23201B]">৳{m.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </form>

          {/* RESULT */}
          <div className="md:col-span-3" aria-live="polite">
            {!loading && !result && !error && (
              <div className="rounded-3xl border-2 border-dashed border-[#23201B]/25 px-8 py-16 text-center">
                <p className={`${hand.className} text-3xl text-[#2F6B4F]`}>your meal shows up here</p>
                <p className="mt-3 text-[#23201B]/70 max-w-sm mx-auto">
                  Pick a budget and tap “Suggest meal”. You’ll see the items, the total, and why the AI chose them.
                </p>
              </div>
            )}

            {loading && (
              <div className={`bg-white px-8 py-10 pb-14 ${RECEIPT_EDGE}`} role="status">
                <p className={`${display.className} text-xl font-extrabold text-center`}>Picking your meal…</p>
                <p className="text-center text-sm text-[#23201B]/60 mb-6">Checking the menu against ৳{budget}</p>
                <div className="space-y-4 animate-pulse motion-reduce:animate-none">
                  {[70, 55, 80].map((w) => (
                    <div key={w} className="flex items-center gap-3">
                      <div className="h-4 rounded bg-[#23201B]/10" style={{ width: `${w}%` }} />
                      <div className="h-4 w-12 rounded bg-[#23201B]/10 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && !loading && (
              <div role="alert" className="rounded-3xl bg-[#23201B] text-[#F6F0E4] p-8">
                <p className={`${display.className} text-2xl font-extrabold`}>{error.title}</p>
                <p className="mt-2 text-[#F6F0E4]/75 leading-relaxed">{error.fix}</p>
                <button onClick={generate} className={`mt-6 rounded-full bg-[#F2674A] text-white font-bold px-7 py-2.5 hover:bg-[#d9533a] transition-colors ${focus}`}>
                  Try again
                </button>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                <div className={`relative -rotate-1 bg-white px-8 py-9 pb-14 shadow-[0_18px_40px_-18px_rgba(35,32,27,0.5)] ${RECEIPT_EDGE}`}>
                  <p className="text-center text-xs text-[#23201B]/60">{canteen.name}, {gender} section</p>
                  <h2 className={`${display.className} text-3xl font-extrabold text-center mt-1`}>{result.meal}</h2>

                  <ul className="mt-6 space-y-3 border-t-2 border-dashed border-[#23201B]/25 pt-6">
                    {result.lines.map((m, i) => (
                      <li key={`${m.name}-${i}`} className="flex items-baseline gap-2 text-lg">
                        <span className="font-semibold">{m.name}</span>
                        <span className="flex-1 border-b border-dotted border-[#23201B]/30 -translate-y-1" aria-hidden="true" />
                        <span className="tabular-nums font-semibold">৳{m.price}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t-2 border-dashed border-[#23201B]/25 pt-6">
                    <div className="flex justify-between font-extrabold text-2xl">
                      <span>Total</span>
                      <span className="tabular-nums">৳{result.total}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-[#23201B]/70">Budget ৳{budget}</span>
                      {result.over > 0 ? (
                        <span className="font-semibold text-[#d9533a]">৳{result.over} over budget</span>
                      ) : (
                        <span className="tabular-nums font-semibold text-[#2F6B4F]">৳{budget - result.total} left over</span>
                      )}
                    </div>
                  </div>

                  {result.reason && (
                    <p className={`${hand.className} text-2xl text-[#2F6B4F] mt-7 leading-snug`}>“{result.reason}”</p>
                  )}
                </div>

                {st && !st.open && (
                  <p className="rounded-2xl bg-[#F4C95D] px-5 py-3 text-sm">
                    The {canteen.name} {gender} section is closed right now.{' '}
                    {st.next ? `Your plan is ready for ${fmt(st.next)}.` : 'Your plan is ready for tomorrow.'}
                  </p>
                )}

                {(result.over > 0 || result.unknown > 0 || result.recalculated) && (
                  <p className="rounded-2xl bg-[#F4C95D] px-5 py-3 text-sm">
                    {result.over > 0 && 'This plan goes over your budget. Tap “Try another” for a cheaper one. '}
                    {result.unknown > 0 && 'The AI named an item that isn’t on the menu, so we left it out. '}
                    {result.recalculated && 'We recalculated the total from the menu prices.'}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={saveToWeek} disabled={saved} className={`rounded-full bg-[#F2674A] text-white font-semibold px-6 py-2.5 hover:bg-[#d9533a] transition-colors disabled:bg-[#2F6B4F] ${focus}`}>
                    {saved ? 'Saved to my week' : 'Save to my week'}
                  </button>
                  <button onClick={generate} className={`rounded-full bg-[#23201B] text-[#F6F0E4] font-semibold px-6 py-2.5 hover:bg-[#F2674A] transition-colors ${focus}`}>
                    Try another
                  </button>
                  <button onClick={copyPlan} className={`rounded-full border-2 border-[#23201B] font-semibold px-6 py-2 hover:bg-[#23201B] hover:text-[#F6F0E4] transition-colors ${focus}`}>
                    {copied ? 'Copied' : 'Copy plan'}
                  </button>
                  {saved && (
                    <Link href="/tracker" className={`text-sm font-semibold underline underline-offset-4 rounded ${focus}`}>
                      View my week
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
