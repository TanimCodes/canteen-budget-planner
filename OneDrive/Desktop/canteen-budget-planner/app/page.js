'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', alt: 'Food' },
  { src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', alt: 'Burger' },
  { src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80', alt: 'Skewers' },
  { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80', alt: 'Salad' },
  { src: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&q=80', alt: 'Toast' },
];

const MEALS = [
  { name: 'Khichuri + egg', price: 50, type: 'veg', kcal: 520 },
  { name: 'Singara + tea', price: 30, type: 'veg', kcal: 280 },
  { name: 'Chicken biryani', price: 120, type: 'nonveg', kcal: 780 },
  { name: 'Rice, dal, veg', price: 60, type: 'veg', kcal: 450 },
  { name: 'Rice + chicken curry', price: 90, type: 'nonveg', kcal: 650 },
  { name: 'Beef tehari', price: 150, type: 'nonveg', kcal: 820 },
  { name: 'Egg paratha', price: 40, type: 'veg', kcal: 390 },
];

const PREFS = [
  { id: 'any', label: 'Anything' },
  { id: 'veg', label: 'Vegetarian' },
  { id: 'nonveg', label: 'Non-veg' },
];

const STEPS = [
  { title: 'Tell us your budget', desc: 'Pick how much you want to spend today. Even ৳30 gets you a plan.' },
  { title: 'Choose what you eat', desc: 'Vegetarian, non-veg, or anything. We only suggest what your canteen serves.' },
  { title: 'Get your meal', desc: 'The Gemma model builds the best-value combo and shows the total before you queue.' },
];

const FEATURES = [
  { title: 'Plans around your wallet', desc: 'Every suggestion fits the budget you set, so you never get to the counter and find out it costs more.', wide: true, bg: 'bg-[#F4C95D]' },
  { title: 'Runs on your device', desc: 'The model runs locally. What you eat and spend stays with you.', bg: 'bg-[#2F6B4F] text-[#F6F0E4]' },
  { title: 'Balanced, not just cheap', desc: 'Combos are ranked by calories per taka, so a small budget still gets a full meal.', bg: 'bg-white' },
  { title: 'Crowd forecast', desc: 'See which hours are quiet and which are packed.', bg: 'bg-[#F4C95D]' },
  { title: 'Skip the queue', desc: 'Reserve a 15-minute pickup slot and walk up with your token.', bg: 'bg-white' },
  { title: 'Built for campus menus', desc: 'Singara, khichuri, tehari. The menu looks like your canteen.', wide: true, bg: 'bg-[#F2674A] text-white' },
];

const FAQS = [
  { q: 'Is it free?', a: 'Yes. It is built for students and costs nothing to use.' },
  { q: 'Which AI model does it use?', a: 'Google’s open Gemma model, running locally.' },
  { q: 'Can I add my own canteen menu?', a: 'Yes. Add your canteen’s items and prices in the planner.' },
];

// Auto-sliding Carousel Component
function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % PHOTOS.length);
    }, 2500); // ২.৫ সেকেন্ড পর পর ছবি বদলাবে
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mt-16 md:mt-20 max-w-6xl mx-auto h-[300px] md:h-[400px] overflow-hidden flex items-center justify-center">
      <div className="flex items-center justify-center relative w-full h-full">
        {PHOTOS.map((photo, index) => {
          let position = index - currentIndex;
          if (position < -2) position += PHOTOS.length;
          if (position > 2) position -= PHOTOS.length;

          return (
            <div
              key={index}
              className="absolute transition-all duration-700 ease-in-out cursor-pointer"
              style={{
                transform: `translateX(${position * 120}px) scale(${position === 0 ? 1.1 : 0.8}) rotate(${position * 5}deg)`,
                zIndex: position === 0 ? 10 : 5 - Math.abs(position),
                opacity: Math.abs(position) > 2 ? 0 : 1 - Math.abs(position) * 0.3,
              }}
            >
              <div className={`w-40 h-56 md:w-56 md:h-80 rounded-[2rem] overflow-hidden border-4 border-white shadow-[0_20px_40px_-15px_rgba(35,32,27,0.4)] ${position === 0 ? 'ring-4 ring-[#F2674A]/20' : ''}`}>
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Campus Board with Updated Timings
function CampusBoard() {
  const [gender, setGender] = useState('male');
  
  const isMale = gender === 'male';
  const timeRange = isMale ? '10:00 AM - 4:00 PM' : '8:20 AM - 1:20 PM';
  const statusText = isMale ? 'Open now until 4:00 PM' : 'Open now until 1:20 PM';
  
  const crowdData = isMale ? [10, 20, 40, 80, 95, 60, 30, 10] : [10, 50, 80, 95, 60, 20, 10]; 
  const hours = isMale ? ['10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'] : ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM'];

  return (
    <section id="timings" className="max-w-5xl mx-auto px-5 pb-24 scroll-mt-24 pt-10">
      <h2 className="font-extrabold tracking-tight text-4xl md:text-5xl leading-tight max-w-2xl text-[#23201B]">
        Know when to go, before you walk over
      </h2>
      <p className="mt-4 text-[#23201B]/70 max-w-xl leading-relaxed">
        Rush hits at different times for male and female sections. Pick your section and see the canteen right now.
      </p>

      <div className="mt-10 grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setGender('male')} 
              className={`rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors ${gender === 'male' ? 'bg-[#23201B] text-[#F6F0E4] border-[#23201B]' : 'border-[#23201B]/25 hover:border-[#23201B]'}`}
            >
              Male section
            </button>
            <button 
              onClick={() => setGender('female')} 
              className={`rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors ${gender === 'female' ? 'bg-[#23201B] text-[#F6F0E4] border-[#23201B]' : 'border-[#23201B]/25 hover:border-[#23201B]'}`}
            >
              Female section
            </button>
          </div>

          <div className="rounded-3xl p-7 bg-[#2F6B4F] text-[#F6F0E4]">
            <p className="text-3xl font-extrabold">Open now</p>
            <p className="mt-1 opacity-85">{statusText}</p>
            
            <p className="mt-4 text-sm font-bold bg-[#F6F0E4]/20 inline-block px-3 py-1 rounded-lg">
              Class Hours: {timeRange}
            </p>
            
            <p className="mt-4 text-lg">
              <span className="font-bold">{isMale ? 'Busy' : 'Packed'}</span>, about 12 min in the queue
            </p>
            <p className="mt-4 rounded-2xl bg-[#F6F0E4]/15 px-4 py-3 text-sm">
              Best time to go: <span className="font-bold">{isMale ? '2:30 PM' : '12:30 PM'}</span>, when it’s usually quiet.
            </p>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <h3 className="font-bold text-lg text-[#23201B]">Crowd through the day</h3>
            <div className="mt-5 flex gap-2 items-end h-36">
              {crowdData.map((c, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div style={{ height: `${c}%` }} className={`w-full rounded-t-lg ${c > 80 ? 'bg-[#F2674A]' : c > 50 ? 'bg-[#F4C95D]' : 'bg-[#2F6B4F]'}`} />
                  <span className="text-[10px] text-[#23201B]/70">{hours[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [budget, setBudget] = useState(100);
  const [pref, setPref] = useState('any');
  
  const plan = (() => {
    const pool = MEALS.filter((m) => pref === 'any' || m.type === pref).sort((a, b) => b.kcal / b.price - a.kcal / a.price);
    let left = budget;
    const picked = [];
    for (const m of pool) {
      if (m.price <= left && picked.length < 3) {
        picked.push(m);
        left -= m.price;
      }
    }
    return { picked, total: budget - left, kcal: picked.reduce((s, m) => s + m.kcal, 0) };
  })();

  return (
    <main className="min-h-screen bg-[#F6F0E4] text-[#23201B] overflow-x-hidden font-sans">
      
      {/* NAVBAR */}
      <nav className="w-full flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b border-[#23201B]/10 sticky top-0 bg-[#F6F0E4]/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-[#F2674A] hover:opacity-80 transition tracking-tighter">
          <div className="w-8 h-8 rounded-lg bg-[#F2674A] flex items-center justify-center text-white text-lg font-black">C</div>
          CanteenAI
        </Link>
        <div className="flex gap-6 font-semibold text-[#23201B] items-center">
          <Link href="/" className="hover:text-[#F2674A] transition">Home</Link>
          <Link href="/menu" className="hover:text-[#F2674A] transition">Menu</Link>
          <a href="#timings" className="hover:text-[#F2674A] transition hidden md:block">Timings</a>
          <Link href="/planner" className="bg-[#23201B] text-white px-5 py-2 rounded-full hover:bg-[#F2674A] transition shadow-md">
            AI Planner
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-5 pt-10 md:pt-16 text-center">
        <h1 className="font-extrabold tracking-tight leading-[1.02] text-5xl sm:text-6xl md:text-7xl max-w-4xl mx-auto">
          Lunch on campus, planned around what you can spend.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[#23201B]/70 max-w-xl mx-auto leading-relaxed">
          Enter your budget. Our local AI picks the best-value meal from your canteen menu.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center relative z-20">
          <Link href="/planner" className="rounded-full bg-[#F2674A] text-white font-bold text-lg px-9 py-3.5 hover:bg-[#d9533a] transition-colors shadow-lg">
            Plan my meal
          </Link>
          <a href="#demo" className="rounded-full border-2 border-[#23201B] font-semibold text-lg px-9 py-3 hover:bg-[#23201B] hover:text-[#F6F0E4] transition-colors">
            Try the demo
          </a>
        </div>

        {/* Auto Photo Carousel */}
        <PhotoCarousel />
      </section>

      {/* DEMO */}
      <section id="demo" className="max-w-5xl mx-auto px-5 pt-10 pb-20 scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="font-extrabold tracking-tight text-4xl md:text-5xl leading-tight">
              Try it with your own budget
            </h2>
            <p className="mt-4 text-[#23201B]/70 max-w-md leading-relaxed">
              This demo uses a sample menu. The real planner uses your canteen’s items and prices.
            </p>

            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <label className="font-semibold">Budget today</label>
                <output className="text-3xl font-extrabold text-[#F2674A]">৳{budget}</output>
              </div>
              <input
                type="range" min={30} max={200} step={10} value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-3 accent-[#F2674A]"
              />
            </div>

            <div className="mt-8">
              <p className="font-semibold mb-3">What do you eat?</p>
              <div className="flex flex-wrap gap-2">
                {PREFS.map((p) => (
                  <button
                    key={p.id} onClick={() => setPref(p.id)}
                    className={`rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors ${
                      pref === p.id ? 'bg-[#23201B] text-[#F6F0E4] border-[#23201B]' : 'border-[#23201B]/25 hover:border-[#23201B]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Receipt */}
          <div className="relative rotate-1 md:rotate-2 bg-white px-7 py-8 shadow-[0_18px_40px_-18px_rgba(35,32,27,0.5)] pb-12 rounded-lg">
            <p className="text-xl font-extrabold text-center">Your meal plan</p>
            <p className="text-center text-xs text-[#23201B]/60 mb-5">Budget ৳{budget}</p>
            {plan.picked.length > 0 ? (
              <ul className="space-y-3 border-t-2 border-dashed border-[#23201B]/25 pt-5">
                {plan.picked.map((m) => (
                  <li key={m.name} className="flex items-baseline gap-2">
                    <span className="font-semibold">{m.name}</span>
                    <span className="flex-1 border-b border-dotted border-[#23201B]/30 translate-y-[-3px]" />
                    <span className="font-semibold">৳{m.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-8 text-[#23201B]/70">Nothing fits this budget.</p>
            )}
            {plan.picked.length > 0 && (
              <div className="mt-5 border-t-2 border-dashed border-[#23201B]/25 pt-5 space-y-1">
                <div className="flex justify-between font-extrabold text-lg">
                  <span>Total</span>
                  <span>৳{plan.total}</span>
                </div>
                <div className="flex justify-between text-sm text-[#23201B]/70">
                  <span>About {plan.kcal} kcal</span>
                  <span className="text-[#2F6B4F] font-semibold">৳{budget - plan.total} left</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CampusBoard />

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[#23201B] text-[#F6F0E4] scroll-mt-24">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="font-extrabold tracking-tight text-4xl md:text-5xl max-w-xl leading-tight">
            Three taps from hungry to sorted
          </h2>
          <ol className="mt-12 grid md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="text-5xl text-[#F4C95D] leading-none">{i + 1}</span>
                <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-[#F6F0E4]/70 leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-5 py-24">
        <h2 className="font-extrabold tracking-tight text-4xl md:text-5xl max-w-xl leading-tight">
          Made for a student’s day
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <article key={f.title} className={`${f.bg} ${f.wide ? 'md:col-span-2' : ''} rounded-3xl p-8 min-h-[190px] flex flex-col justify-end shadow-sm`}>
              <h3 className="text-2xl font-extrabold">{f.title}</h3>
              <p className="mt-2 max-w-md leading-relaxed opacity-85">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-2xl mx-auto px-5 pb-24 scroll-mt-24">
        <h2 className="font-extrabold tracking-tight text-4xl text-center mb-10">Questions</h2>
        <div className="divide-y divide-[#23201B]/15 border-y border-[#23201B]/15">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-lg">
                {f.q}
                <span className="text-2xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[#23201B]/70 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-24">
        <div className="max-w-4xl mx-auto rounded-[2rem] bg-[#F2674A] text-white text-center px-6 py-16 shadow-lg">
          <h2 className="font-extrabold tracking-tight text-4xl md:text-5xl leading-tight max-w-xl mx-auto">
            Know what lunch costs before you queue
          </h2>
          <Link href="/planner" className="mt-8 inline-block rounded-full bg-[#23201B] text-[#F6F0E4] font-bold text-lg px-9 py-3.5 hover:bg-white hover:text-[#23201B] transition-colors">
            Plan my meal
          </Link>
        </div>
      </section>

      {/* ATTRACTIVE FOOTER */}
      <footer className="bg-white border-t border-[#23201B]/10 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-[#F2674A] mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#F2674A] flex items-center justify-center text-white text-lg font-black">C</div>
                CanteenAI
              </Link>
              <p className="text-[#23201B]/60 leading-relaxed max-w-sm">
                Helping students eat smart and save more on campus with the power of open-source AI. Built for the Hacktoberfest Hackathon.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-[#23201B]">Platform</h4>
              <ul className="space-y-3 text-[#23201B]/60 font-medium">
                <li><Link href="/" className="hover:text-[#F2674A] transition">Home</Link></li>
                <li><Link href="/menu" className="hover:text-[#F2674A] transition">Canteen Menu</Link></li>
                <li><Link href="/planner" className="hover:text-[#F2674A] transition">AI Planner</Link></li>
                <li><a href="#timings" className="hover:text-[#F2674A] transition">Campus Timings</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-[#23201B]">Tech Stack</h4>
              <ul className="space-y-3 text-[#23201B]/60 font-medium">
                <li>Next.js</li>
                <li>Tailwind CSS</li>
                <li>Gemma via Ollama</li>
                <li>JSON Database</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#23201B]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#23201B]/50">
            <p>© 2026 CanteenAI. Built for the Hackathon.</p>
            <p className="flex items-center gap-1">Made with <span className="text-[#F2674A] text-lg">♥</span> and Open Source.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}