import React from 'react';
import { Sunrise, Sunset, Sun } from 'lucide-react';
import { formatCityLocalTime, calculateSunProgress } from '../utils/weatherUtils';

export default function SunTracker({ sys, timezone }) {
  if (!sys?.sunrise || !sys?.sunset) return null;

  const sunriseFormatted = formatCityLocalTime(sys.sunrise, timezone);
  const sunsetFormatted = formatCityLocalTime(sys.sunset, timezone);
  const sunProgress = calculateSunProgress(sys.sunrise, sys.sunset, timezone);

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-5 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-amber-400" />
          Sun Schedule & Daylight Cycle
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/15">
          {sunProgress > 0 && sunProgress < 100 ? `${sunProgress}% daylight elapsed` : sunProgress === 100 ? 'Night Time' : 'Before Dawn'}
        </span>
      </div>

      {/* Sun Arc / Progress Track */}
      <div className="relative w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-amber-400/50"
          style={{ width: `${Math.max(5, sunProgress)}%` }}
        />
      </div>

      {/* Sunrise & Sunset Timestamps */}
      <div className="flex items-center justify-between mt-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Sunrise className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Sunrise</p>
            <p className="text-white font-extrabold">{sunriseFormatted}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Sunset</p>
            <p className="text-white font-extrabold">{sunsetFormatted}</p>
          </div>
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Sunset className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
