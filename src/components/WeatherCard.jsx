import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Sparkles,
  RefreshCw,
  Sun,
  CloudRain,
  Cloud,
  Snowflake,
  Zap,
} from 'lucide-react';
import { formatTemp, formatCityLocalTime, formatCityDate } from '../utils/weatherUtils';

export default function WeatherCard({
  weatherData,
  tempUnit,
  onRefresh,
  isRefreshing,
  isSimulated,
}) {
  const [imageError, setImageError] = useState(false);

  if (!weatherData) return null;

  const { name, sys, main, weather, timezone, dt } = weatherData;
  const condition = weather && weather[0] ? weather[0] : {};
  const iconCode = condition.icon || '01d';
  const description = condition.description || 'Clear Sky';
  const mainCondition = condition.main || 'Clear';

  // OpenWeatherMap 4x high resolution icon
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  // Fallback icon based on condition if image fails to load
  const renderFallbackIcon = () => {
    const id = condition.id || 800;
    if (id >= 200 && id < 300) return <Zap className="w-24 h-24 text-amber-300 animate-pulse" />;
    if (id >= 300 && id < 600) return <CloudRain className="w-24 h-24 text-cyan-300 animate-bounce" />;
    if (id >= 600 && id < 700) return <Snowflake className="w-24 h-24 text-blue-200 animate-spin" />;
    if (id >= 700 && id < 800) return <Cloud className="w-24 h-24 text-slate-300" />;
    if (id === 800) return <Sun className="w-24 h-24 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />;
    return <Cloud className="w-24 h-24 text-sky-300" />;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl transition-all border border-white/20 overflow-hidden">
      {/* Ambient background glow inside the card */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Location & Local Time Info */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-white/10">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {name}
            </h2>
            {sys?.country && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/20 text-white tracking-wide">
                {sys.country}
              </span>
            )}
            {isSimulated && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40">
                <Sparkles className="w-3 h-3" />
                Simulated
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatCityDate(timezone)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Local Time: {formatCityLocalTime(dt, timezone)}
            </span>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh current weather"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-300 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Temperature & Weather Condition Display */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-6 py-6 sm:py-8">
        {/* Left: Weather Icon & Visual Condition */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
            <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-2xl animate-pulse-glow" />
            {!imageError ? (
              <img
                src={iconUrl}
                alt={description}
                onError={() => setImageError(true)}
                className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]"
              />
            ) : (
              renderFallbackIcon()
            )}
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white capitalize tracking-wide mt-1">
            {description}
          </p>
          <span className="text-xs uppercase tracking-wider text-cyan-300 font-semibold mt-0.5">
            {mainCondition}
          </span>
        </div>

        {/* Right: Primary Temperature & Range */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left justify-center">
          <div className="flex items-baseline">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter drop-shadow-md">
              {formatTemp(main?.temp, tempUnit).replace(`°${tempUnit}`, '')}
            </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-400 ml-1">
              °{tempUnit}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
            Feels like{' '}
            <span className="text-white font-bold">
              {formatTemp(main?.feels_like, tempUnit)}
            </span>
          </p>

          {/* High / Low Temperature Badges */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15 text-xs font-semibold">
              <ArrowUp className="w-3.5 h-3.5 text-rose-400" />
              <span>High: {formatTemp(main?.temp_max, tempUnit)}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15 text-xs font-semibold">
              <ArrowDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Low: {formatTemp(main?.temp_min, tempUnit)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
