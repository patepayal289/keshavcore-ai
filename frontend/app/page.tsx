
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 relative overflow-hidden text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient"></div>

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-400/30 blur-[150px] rounded-full -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-400/30 blur-[150px] rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>

      {/* Animated Title */}
      <h1 className="text-6xl font-bold text-center relative z-10 animate-title 
      bg-gradient-to-r from-white via-pink-200 to-white 
      bg-clip-text text-transparent">
        Welcome to KeshavCore AI
      </h1>

      <Link href="/login" className="relative z-10">
        <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-110 transition duration-300">
          Get Started
        </button>
      </Link>

    </main>
  );
}

