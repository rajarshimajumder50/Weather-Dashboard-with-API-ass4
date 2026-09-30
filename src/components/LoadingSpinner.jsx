import React from 'react';
import { CloudSun, Loader2 } from 'lucide-react';

export default function LoadingSpinner({ cityName }) {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-20 px-6 glass-panel rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
      {/* Background pulsing glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 animate-pulse pointer-events-none" />

      <div className="relative flex items-center justify-center mb-6">
        {/* Outer spinning ring */}
        <div className="w-20 h-20 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        {/* Inner pulsing icon */}
        <div className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-300">
          <CloudSun className="w-7 h-7 animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl">
        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
        <span>Fetching Weather Data...</span>
      </div>

      {cityName && (
        <p className="text-xs sm:text-sm text-cyan-200/80 font-medium mt-2">
          Retrieving live atmospheric conditions for <span className="font-semibold text-white">"{cityName}"</span>
        </p>
      )}

      {/* Skeleton Preview Bars */}
      <div className="w-full max-w-md mt-8 space-y-3">
        <div className="h-4 bg-white/10 rounded-full animate-pulse" />
        <div className="h-4 bg-white/10 rounded-full animate-pulse w-5/6 mx-auto" />
      </div>
    </div>
  );
}
