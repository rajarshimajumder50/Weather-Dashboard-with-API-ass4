import React, { useState } from 'react';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  getActiveApiKey,
  saveCustomApiKey,
  resetCustomApiKey,
  DEFAULT_API_KEY,
  fetchWeatherByCity,
} from '../services/weatherService';

export default function ApiKeyModal({
  isOpen,
  onClose,
  onKeyUpdated,
  isSimulatedMode,
  onToggleSimulatedMode,
}) {
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    const active = getActiveApiKey();
    return active === DEFAULT_API_KEY ? '' : active;
  });
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { success: boolean, message: string } | null
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const isUsingCustom = !!localStorage.getItem('skyPulse_custom_api_key');
  const isUsingEnv = !!(import.meta.env.VITE_OPENWEATHER_API_KEY && !isUsingCustom);

  const handleSave = () => {
    saveCustomApiKey(apiKeyInput);
    if (onKeyUpdated) onKeyUpdated();
    onClose();
  };

  const handleReset = () => {
    resetCustomApiKey();
    setApiKeyInput('');
    setTestStatus({ success: true, message: 'Reset to default fallback key.' });
    if (onKeyUpdated) onKeyUpdated();
  };

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim() || DEFAULT_API_KEY;
    setIsTesting(true);
    setTestStatus(null);

    try {
      await fetchWeatherByCity('London', keyToTest);
      setTestStatus({
        success: true,
        message: 'Key is valid and active! Successfully communicated with OpenWeatherMap.',
      });
    } catch (err) {
      setTestStatus({
        success: false,
        message: err.message || 'Key validation failed.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">API Key & Data Settings</h3>
              <p className="text-xs text-slate-400">OpenWeatherMap API Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="relative z-10 mt-5 space-y-4 text-xs sm:text-sm">
          {/* Active Key Status pill */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Active Key Source:</span>
            <span className="font-semibold text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-xs">
              {isUsingCustom ? 'Custom User Key' : isUsingEnv ? '.env Variable' : 'Default Fallback Key'}
            </span>
          </div>

          {/* Custom Key Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Enter Custom OpenWeatherMap API Key
            </label>
            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Paste your 32-character API key..."
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-black/40 text-white placeholder-slate-400 border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 text-slate-400 hover:text-white p-1 text-xs"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Your key is saved locally in your browser and never sent to external servers.
            </p>
          </div>

          {/* Test Status feedback */}
          {testStatus && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                testStatus.success
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
              }`}
            >
              {testStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{testStatus.message}</span>
            </div>
          )}

          {/* Offline / Demo Mode Toggle */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <p className="font-semibold text-white text-xs">Simulated Demo Mode</p>
                <p className="text-[11px] text-slate-400">Instantly test offline without API limits</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSimulatedMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isSimulatedMode ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isSimulatedMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Link to OpenWeatherMap */}
          <div className="pt-1">
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <span>Get a free OpenWeatherMap API Key</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="relative z-10 flex items-center justify-between gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {isTesting ? 'Testing...' : 'Test Key'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all active:scale-95"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
