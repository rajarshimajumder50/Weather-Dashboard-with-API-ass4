import React from 'react';
import { CloudSun, KeyRound, MapPin, Sparkles } from 'lucide-react';

export default function Header({
  tempUnit,
  onToggleTempUnit,
  onOpenSettings,
  onDetectLocation,
  isLocating,
  isSimulated,
}) {
  return (
    <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 sm:px-6">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 border border-white/20">
          <CloudSun className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              SkyPulse
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Assignment 4
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium hidden sm:block">
            Production Weather Dashboard • OpenWeatherMap API
          </p>
        </div>
      </div>

      {/* Control Buttons: Unit Switcher, Geolocation, Settings */}
      <div className="flex items-center gap-2.5">
        {/* Simulated indicator badge if active */}
        {isSimulated && (
          <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Demo Mode</span>
          </div>
        )}

        {/* Current Location GPS Button */}
        <button
          onClick={onDetectLocation}
          disabled={isLocating}
          title="Use Current Location"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <MapPin className={`w-3.5 h-3.5 text-cyan-400 ${isLocating ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
        </button>

        {/* Temperature Unit Toggle Button */}
        <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/15 backdrop-blur-md">
          <button
            onClick={() => onToggleTempUnit('C')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              tempUnit === 'C'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Celsius"
          >
            °C
          </button>
          <button
            onClick={() => onToggleTempUnit('F')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              tempUnit === 'F'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Fahrenheit"
          >
            °F
          </button>
        </div>

        {/* API Key / Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Configure OpenWeatherMap API Key"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all shadow-sm active:scale-95"
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">API Key</span>
        </button>
      </div>
    </header>
  );
}
