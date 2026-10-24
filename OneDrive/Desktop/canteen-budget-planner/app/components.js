import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full backdrop-blur-md bg-black/30 border-b border-white/10 z-50 text-white">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-400">🍔 CanteenAI</Link>
        <div className="space-x-4 font-medium text-sm">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <Link href="/planner" className="hover:text-blue-400 transition">AI Planner</Link>
          <Link href="/menu" className="hover:text-blue-400 transition">Full Menu</Link>
        </div>
      </div>
    </nav>
  );
}