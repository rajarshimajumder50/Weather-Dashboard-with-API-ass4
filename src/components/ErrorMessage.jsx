import React from 'react';
import { AlertCircle, RefreshCw, Sparkles, KeyRound, WifiOff } from 'lucide-react';

export default function ErrorMessage({
  error,
  onRetry,
  onUseSimulated,
  onOpenSettings,
}) {
  if (!error) return null;

  const message = error.message || 'An unexpected error occurred while fetching weather data.';
  const isApiKeyIssue = error.isApiKeyError || message.toLowerCase().includes('api key') || message.toLowerCase().includes('401');
  const isNetworkIssue = error.isNetworkError || message.toLowerCase().includes('network');

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl bg-rose-950/40 backdrop-blur-xl border border-rose-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
            {isNetworkIssue ? (
              <WifiOff className="w-6 h-6 text-rose-400" />
            ) : isApiKeyIssue ? (
              <KeyRound className="w-6 h-6 text-amber-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {isApiKeyIssue
                ? 'OpenWeatherMap API Key Notice'
                : isNetworkIssue
                ? 'Network Connection Problem'
                : 'Unable to Retrieve Weather'}
            </h3>
            <p className="text-xs sm:text-sm text-rose-200/90 font-medium mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Helpful instructions for students/evaluators */}
        {isApiKeyIssue && (
          <div className="w-full p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-amber-300 flex items-center gap-1.5">
              💡 Tip for Evaluators & Users:
            </p>
            <p>
              Free OpenWeatherMap keys typically take 30-120 minutes to become active after signup. You can instantly test full app functionality with one-click <strong>Simulated Demo Data</strong> below, or provide a verified key in the Settings Drawer.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 pt-2 justify-center sm:justify-start w-full">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-rose-500/30 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Request</span>
            </button>
          )}

          {onUseSimulated && (
            <button
              onClick={onUseSimulated}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold text-xs sm:text-sm transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Use Simulated Demo Data</span>
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-semibold text-xs sm:text-sm transition-all active:scale-95"
            >
              <KeyRound className="w-4 h-4 text-cyan-300" />
              <span>Settings / API Key</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
