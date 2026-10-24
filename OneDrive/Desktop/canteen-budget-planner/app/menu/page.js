import Link from 'next/link';

export default function Menu() {
  const menuItems = [
    { name: "Khichuri + Egg", price: 50, type: "Veg", kcal: 520, protein: "18g", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80" },
    { name: "Singara + Tea", price: 30, type: "Veg", kcal: 280, protein: "5g", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80" },
    { name: "Chicken Biryani", price: 120, type: "Non-veg", kcal: 780, protein: "35g", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80" },
    { name: "Rice + Dal + Veg", price: 60, type: "Veg", kcal: 450, protein: "12g", img: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=500&q=80" },
    { name: "Rice + Chicken Curry", price: 90, type: "Non-veg", kcal: 650, protein: "28g", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80" },
    { name: "Beef Tehari", price: 150, type: "Non-veg", kcal: 820, protein: "40g", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&q=80" },
    { name: "Egg Paratha", price: 40, type: "Veg", kcal: 390, protein: "15g", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80" },
  ];

  return (
    <main className="min-h-screen bg-[#F6F0E4] text-[#23201B] font-sans selection:bg-[#F2674A] selection:text-white">
      <nav className="w-full flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b border-[#23201B]/10 sticky top-0 bg-[#F6F0E4]/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-[#F2674A] hover:opacity-80 transition tracking-tighter">
          <div className="w-8 h-8 rounded-lg bg-[#F2674A] flex items-center justify-center text-white text-lg font-black">C</div>
          CanteenAI
        </Link>
        <div className="flex gap-6 font-semibold text-[#23201B] items-center">
          <Link href="/" className="hover:text-[#F2674A] transition">Home</Link>
          <Link href="/menu" className="text-[#F2674A]">Menu</Link>
          <Link href="/planner" className="bg-[#23201B] text-white px-5 py-2 rounded-full hover:bg-[#F2674A] transition shadow-md">
            AI Planner
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="text-center mb-16">
          <span className="bg-[#F4C95D]/30 text-[#23201B] px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-4 inline-block">
            Today's Fresh Menu
          </span>
          <h1 className="font-extrabold text-5xl md:text-6xl mb-4 tracking-tight">Explore Campus Food</h1>
          <p className="text-[#23201B]/60 max-w-xl mx-auto text-lg">
            Browse through our canteen's top picks. Find your favourite meal, check the calories, and head over to the AI Planner to get a custom recommendation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, idx) => (
            <div key={idx} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(35,32,27,0.15)] transition-all duration-300 border border-[#23201B]/5 flex flex-col hover:-translate-y-1">
              <div className="relative h-52 overflow-hidden bg-gray-200">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                  item.type === 'Veg' ? 'bg-[#2F6B4F]/90 text-white' : 'bg-[#F2674A]/90 text-white'
                }`}>
                  {item.type}
                </div>

                <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md text-[#23201B] font-extrabold px-4 py-1.5 rounded-xl shadow-sm">
                  ৳{item.price}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-extrabold text-2xl mb-2 text-[#23201B] group-hover:text-[#F2674A] transition-colors">{item.name}</h3>
                
                <div className="flex gap-4 text-sm text-[#23201B]/60 mb-6 font-medium">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#F2674A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                    </svg>
                    {item.kcal} kcal
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#2F6B4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    {item.protein} protein
                  </div>
                </div>

                <div className="mt-auto">
                  <Link href="/planner" className="block text-center w-full bg-[#F6F0E4] text-[#23201B] font-bold py-3 rounded-xl hover:bg-[#23201B] hover:text-white transition-colors">
                    Plan with AI
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}