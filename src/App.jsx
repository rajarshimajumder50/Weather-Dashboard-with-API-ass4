import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherMetrics from './components/WeatherMetrics';
import SunTracker from './components/SunTracker';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ApiKeyModal from './components/ApiKeyModal';
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  getSimulatedWeatherData,
} from './services/weatherService';
import { getWeatherBackground } from './utils/weatherUtils';

const DEFAULT_CITY = 'London';
const RECENT_SEARCHES_STORAGE_KEY = 'skyPulse_recent_searches';
const TEMP_UNIT_STORAGE_KEY = 'skyPulse_temp_unit';

export default function App() {
  // Primary application state
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [forceSimulatedMode, setForceSimulatedMode] = useState(false);

  // Settings & preferences state
  const [tempUnit, setTempUnit] = useState(() => {
    return localStorage.getItem(TEMP_UNIT_STORAGE_KEY) || 'C';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['London', 'New York', 'Tokyo', 'Kolkata'];
    } catch {
      return ['London', 'New York', 'Tokyo', 'Kolkata'];
    }
  });

  // Save temperature unit preference
  const handleToggleTempUnit = (unit) => {
    setTempUnit(unit);
    localStorage.setItem(TEMP_UNIT_STORAGE_KEY, unit);
  };

  // Update recent searches list
  const addRecentSearch = (newCity) => {
    const trimmed = newCity.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent searches', e);
      }
      return updated;
    });
  };

  const handleClearRecents = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
  };

  /**
   * Core API Fetching function utilizing fetch() and async/await
   */
  const loadWeatherData = useCallback(
    async (targetCity, isRefresh = false) => {
      if (!isRefresh) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      // If user enabled forced simulated mode, return simulated mock data directly
      if (forceSimulatedMode) {
        setTimeout(() => {
          const simulated = getSimulatedWeatherData(targetCity);
          setWeatherData(simulated.data);
          setIsSimulated(true);
          setIsLoading(false);
          setIsRefreshing(false);
          addRecentSearch(simulated.data.name);
        }, 400);
        return;
      }

      try {
        const result = await fetchWeatherByCity(targetCity);
        setWeatherData(result.data);
        setIsSimulated(result.isSimulated);
        setCity(result.data.name);
        addRecentSearch(result.data.name);
      } catch (err) {
        console.warn('API Error encountered:', err.message);
        setError(err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [forceSimulatedMode]
  );

  /**
   * Geolocation search
   */
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported by your current browser.'));
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setIsLoading(true);
          const { latitude, longitude } = position.coords;
          const result = await fetchWeatherByCoords(latitude, longitude);
          setWeatherData(result.data);
          setIsSimulated(false);
          setCity(result.data.name);
          addRecentSearch(result.data.name);
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (geoError.code === 1) msg = 'Location access was denied. Please allow location permissions or search by city name.';
        if (geoError.code === 2) msg = 'Location information is currently unavailable.';
        if (geoError.code === 3) msg = 'Location request timed out. Please try again.';
        setError(new Error(msg));
      },
      { timeout: 10000 }
    );
  };

  /**
   * Default initial state loading a default city on first load via useEffect()
   */
  useEffect(() => {
    let isCancelled = false;

    const fetchInitial = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchWeatherByCity(DEFAULT_CITY);
        if (!isCancelled) {
          setWeatherData(result.data);
          setIsSimulated(result.isSimulated);
          setCity(result.data.name);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchInitial();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSearch = (searchCity) => {
    setCity(searchCity);
    loadWeatherData(searchCity);
  };

  const handleRetry = () => {
    loadWeatherData(city);
  };

  const handleUseSimulatedFallback = () => {
    const simulated = getSimulatedWeatherData(city);
    setWeatherData(simulated.data);
    setIsSimulated(true);
    setError(null);
  };

  // Determine dynamic background gradient based on current weather condition
  const weatherCode = weatherData?.weather?.[0]?.id ?? 800;
  const weatherIcon = weatherData?.weather?.[0]?.icon ?? '01d';
  const bgConfig = getWeatherBackground(weatherCode, weatherIcon);

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${bgConfig.gradient} transition-all duration-1000 flex flex-col items-center justify-between text-white selection:bg-cyan-500 selection:text-white relative`}
    >
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-6">
        {/* Top Header */}
        <Header
          tempUnit={tempUnit}
          onToggleTempUnit={handleToggleTempUnit}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onDetectLocation={handleDetectLocation}
          isLocating={isLocating}
          isSimulated={isSimulated}
        />

        {/* Search Bar & Quick Chips */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          currentCity={city}
          recentSearches={recentSearches}
          onClearRecents={handleClearRecents}
        />

        {/* Dynamic Condition State Tag */}
        {weatherData && !isLoading && !error && (
          <div className="w-full max-w-3xl mx-auto flex items-center justify-between px-2 text-xs">
            <span className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Atmosphere: <strong className="text-white">{bgConfig.name}</strong>
            </span>
            <span className="text-slate-400 font-medium">
              {isSimulated ? 'Mode: Simulated Mock' : 'Mode: OpenWeatherMap Live API'}
            </span>
          </div>
        )}

        {/* Content Area: Loading, Error, or Dashboard View */}
        <main className="w-full flex flex-col gap-6 items-center">
          {isLoading ? (
            <LoadingSpinner cityName={city} />
          ) : error ? (
            <ErrorMessage
              error={error}
              onRetry={handleRetry}
              onUseSimulated={handleUseSimulatedFallback}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          ) : weatherData ? (
            <>
              {/* Primary Compact Weather Card */}
              <WeatherCard
                weatherData={weatherData}
                tempUnit={tempUnit}
                onRefresh={() => loadWeatherData(city, true)}
                isRefreshing={isRefreshing}
                isSimulated={isSimulated}
              />

              {/* Sun Schedule Arc Tracker */}
              <SunTracker
                sys={weatherData.sys}
                timezone={weatherData.timezone}
              />

              {/* Responsive Weather Metrics Grid (2x2 Mobile, 4 Desktop) */}
              <WeatherMetrics
                weatherData={weatherData}
                tempUnit={tempUnit}
              />
            </>
          ) : null}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 mt-12 border-t border-white/10 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 justify-center">
            <span>Assignment 4: Weather Dashboard</span>
            <span>•</span>
            <span className="text-slate-300 font-medium">React SPA</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Powered by OpenWeatherMap API • `fetch()`, `async/await`, & `useEffect()`
          </p>
        </div>
      </footer>

      {/* Settings / API Key Drawer Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeyUpdated={() => loadWeatherData(city)}
        isSimulatedMode={forceSimulatedMode}
        onToggleSimulatedMode={() => {
          const next = !forceSimulatedMode;
          setForceSimulatedMode(next);
          if (next) {
            handleUseSimulatedFallback();
          } else {
            loadWeatherData(city);
          }
        }}
      />
    </div>
  );
}
