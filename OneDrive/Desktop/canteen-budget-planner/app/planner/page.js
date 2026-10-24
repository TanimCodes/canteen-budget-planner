"use client";
import { useState } from "react";
import Link from 'next/link';

export default function Planner() {
  const [budget, setBudget] = useState(70);
  const [pref, setPref] = useState("High Protein");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAISubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const prompt = `You are a canteen assistant. Menu: Rice 20 BDT, Chicken 50 BDT, Egg 15 BDT, Veg 20 BDT. Budget is ${budget} BDT and user wants ${pref}. Output your answer ONLY in strict JSON format with keys: "recommended_meal", "items", "total_cost", "reason".`;

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma4:e2b",
          prompt: prompt,
          format: "json",
          stream: false
        })
      });
      const data = await response.json();
      setResult(JSON.parse(data.response));
    } catch (error) {
      console.error("Error fetching AI response", error);
      alert("AI error! Make sure Ollama is running locally.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F0E4] text-[#23201B] font-sans">
      <nav className="w-full flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b border-[#23201B]/10 sticky top-0 bg-[#F6F0E4]/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-[#F2674A] hover:opacity-80 transition tracking-tighter">
          <div className="w-8 h-8 rounded-lg bg-[#F2674A] flex items-center justify-center text-white text-lg font-black">C</div>
          CanteenAI
        </Link>
        <div className="flex gap-6 font-semibold text-[#23201B] items-center">
          <Link href="/" className="hover:text-[#F2674A] transition">Home</Link>
          <Link href="/menu" className="hover:text-[#F2674A] transition">Menu</Link>
          <Link href="/planner" className="bg-[#23201B] text-white px-5 py-2 rounded-full hover:bg-[#F2674A] transition shadow-md">
            AI Planner
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 py-12 grid md:grid-cols-2 gap-12">
        
        {/* Left Side: Inputs */}
        <div>
          <h1 className="font-extrabold text-4xl md:text-5xl mb-4">Ask our AI for a meal</h1>
          <p className="text-[#23201B]/70 mb-8">Powered by Gemma AI. Enter your budget and preference.</p>

          <form onSubmit={handleAISubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-[#23201B]/10">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="font-semibold">Budget (BDT)</label>
                <output className="text-3xl font-extrabold text-[#F2674A]">৳{budget}</output>
              </div>
              <input
                type="range" min={30} max={200} step={10} value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-3 accent-[#F2674A]"
              />
            </div>

            <div>
              <p className="font-semibold mb-3">Dietary Preference</p>
              <div className="flex flex-wrap gap-2">
                {['High Protein', 'Vegetarian', 'Low Calorie'].map((p) => (
                  <button
                    key={p} type="button" onClick={() => setPref(p)}
                    className={`rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors ${
                      pref === p ? 'bg-[#23201B] text-[#F6F0E4] border-[#23201B]' : 'border-[#23201B]/25 hover:border-[#23201B]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#F2674A] text-white font-bold text-lg px-8 py-3.5 rounded-full hover:bg-[#d9533a] transition-colors disabled:opacity-50"
            >
              {loading ? "AI is thinking..." : "Generate Meal with AI"}
            </button>
          </form>
        </div>

        {/* Right Side: AI Result */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#23201B]/10 flex flex-col justify-center min-h-[400px]">
          {loading ? (
            <div className="text-center text-[#23201B]/60 animate-pulse">
              <p className="text-xl font-bold mb-2">Consulting Gemma AI...</p>
              <p>Crunching the numbers.</p>
            </div>
          ) : result ? (
            <div>
              <p className="text-xl font-extrabold text-center text-[#F2674A] mb-1">AI Recommendation</p>
              <p className="text-center text-xs text-[#23201B]/60 mb-6">For your ৳{budget} budget</p>
              
              <h3 className="text-2xl font-bold text-center mb-6">{result.recommended_meal}</h3>

              <ul className="space-y-3 border-t-2 border-dashed border-[#23201B]/25 pt-5">
                {/* এখানে চেক করা হচ্ছে items অ্যারে কি না, এবং আইটেম অবজেক্ট হলে তার নাম বের করা হচ্ছে */}
                {Array.isArray(result.items) ? (
                  result.items.map((item, idx) => (
                    <li key={idx} className="flex items-baseline gap-2">
                      <span className="font-semibold">
                        {typeof item === 'object' ? (item.item || item.name || JSON.stringify(item)) : item}
                      </span>
                      <span className="flex-1 border-b border-dotted border-[#23201B]/30 translate-y-[-3px]" />
                    </li>
                  ))
                ) : (
                  <li className="font-semibold">{result.items}</li>
                )}
              </ul>

              <div className="mt-5 border-t-2 border-dashed border-[#23201B]/25 pt-5 space-y-1">
                <div className="flex justify-between font-extrabold text-lg">
                  <span>Total Cost</span>
                  <span>৳{result.total_cost}</span>
                </div>
              </div>

              <div className="mt-6 bg-[#F6F0E4] p-4 rounded-xl">
                <p className="text-sm italic text-[#23201B]/80">"{result.reason}"</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-[#23201B]/40">
              <p className="text-6xl mb-4">🍽️</p>
              <p className="font-semibold text-lg">Your AI meal plan will appear here.</p>
              <p className="text-sm mt-2">Adjust budget and click Generate.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}