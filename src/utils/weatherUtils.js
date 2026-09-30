/**
 * Utility functions for temperature conversions, time calculations,
 * and dynamic background gradient mappings.
 */

// Convert Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

// Format temperature according to the selected unit ('C' or 'F')
export const formatTemp = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  const temp = unit === 'F' ? celsiusToFahrenheit(celsius) : celsius;
  return `${Math.round(temp)}°${unit}`;
};

// Convert Wind Speed (m/s) to km/h or mph
export const formatWindSpeed = (speedInMps, unit = 'metric') => {
  if (speedInMps === null || speedInMps === undefined || isNaN(speedInMps)) return '--';
  if (unit === 'imperial') {
    // 1 m/s = 2.23694 mph
    const mph = speedInMps * 2.23694;
    return `${mph.toFixed(1)} mph`;
  }
  // 1 m/s = 3.6 km/h
  const kmh = speedInMps * 3.6;
  return `${kmh.toFixed(1)} km/h`;
};

/**
 * Format Unix timestamp to Clean Local Time (hh:mm AM/PM)
 * taking into account the target city's timezone offset in seconds.
 * 
 * @param {number} unixSeconds - UTC timestamp in seconds
 * @param {number} timezoneOffsetSeconds - Shift in seconds from UTC (OpenWeatherMap `timezone`)
 * @returns {string} Formatted time string e.g. "06:15 AM"
 */
export const formatCityLocalTime = (unixSeconds, timezoneOffsetSeconds = 0) => {
  if (!unixSeconds) return '--:--';
  
  // Create Date object adjusted by city offset
  // Date UTC milliseconds + (timezoneOffsetSeconds * 1000)
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  
  // Format as UTC since we already added the target timezone offset
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

/**
 * Format current date & day for the target city
 */
export const formatCityDate = (timezoneOffsetSeconds = 0) => {
  const nowUtc = Math.floor(Date.now() / 1000);
  const date = new Date((nowUtc + timezoneOffsetSeconds) * 1000);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const dayOfMonth = date.getUTCDate();
  
  return `${dayName}, ${monthName} ${dayOfMonth}`;
};

/**
 * Returns a dynamic background gradient configuration matching the weather condition & day/night
 * 
 * OpenWeather icon code ending with 'd' is Day, 'n' is Night.
 * Weather condition codes:
 * 2xx: Thunderstorm
 * 3xx: Drizzle
 * 5xx: Rain
 * 6xx: Snow
 * 7xx: Atmosphere (Mist, Smoke, Haze, Fog)
 * 800: Clear
 * 80x: Clouds
 */
export const getWeatherBackground = (weatherCode, icon = '01d') => {
  const isNight = icon?.endsWith('n');

  if (weatherCode >= 200 && weatherCode < 300) {
    // Thunderstorm
    return {
      gradient: 'from-slate-950 via-purple-950 to-slate-900',
      accent: 'border-purple-500/30 text-purple-300',
      name: 'Thunderstorm',
      cardGlass: 'bg-purple-950/25',
    };
  }

  if ((weatherCode >= 300 && weatherCode < 400) || (weatherCode >= 500 && weatherCode < 600)) {
    // Rain or Drizzle
    return {
      gradient: isNight
        ? 'from-slate-950 via-cyan-950 to-blue-950'
        : 'from-slate-900 via-teal-900 to-sky-950',
      accent: 'border-cyan-500/30 text-cyan-300',
      name: 'Rainy',
      cardGlass: 'bg-cyan-950/25',
    };
  }

  if (weatherCode >= 600 && weatherCode < 700) {
    // Snow
    return {
      gradient: isNight
        ? 'from-slate-950 via-blue-950 to-indigo-950'
        : 'from-sky-900 via-indigo-950 to-slate-900',
      accent: 'border-sky-300/30 text-sky-200',
      name: 'Snowy',
      cardGlass: 'bg-sky-950/25',
    };
  }

  if (weatherCode >= 700 && weatherCode < 800) {
    // Mist / Fog / Haze
    return {
      gradient: 'from-zinc-900 via-slate-800 to-stone-900',
      accent: 'border-stone-400/30 text-stone-300',
      name: 'Mist & Fog',
      cardGlass: 'bg-slate-900/30',
    };
  }

  if (weatherCode === 800) {
    // Clear Sky
    return {
      gradient: isNight
        ? 'from-slate-950 via-indigo-950 to-slate-900'
        : 'from-blue-600 via-sky-500 to-indigo-700',
      accent: isNight ? 'border-indigo-500/30 text-indigo-300' : 'border-amber-400/30 text-amber-200',
      name: isNight ? 'Clear Night' : 'Sunny & Clear',
      cardGlass: isNight ? 'bg-indigo-950/25' : 'bg-white/15',
    };
  }

  // Clouds (801-804)
  return {
    gradient: isNight
      ? 'from-slate-950 via-slate-900 to-zinc-900'
      : 'from-slate-800 via-slate-700 to-blue-900',
    accent: 'border-slate-400/30 text-slate-300',
    name: 'Cloudy',
    cardGlass: 'bg-white/10',
  };
};

/**
 * Calculate Sun Progress Percentage (0% to 100%) for visual sun arc
 */
export const calculateSunProgress = (sunrise, sunset, timezoneOffset = 0) => {
  if (!sunrise || !sunset) return 0;
  const now = Math.floor(Date.now() / 1000) + timezoneOffset;
  const adjustedSunrise = sunrise + timezoneOffset;
  const adjustedSunset = sunset + timezoneOffset;

  if (now <= adjustedSunrise) return 0;
  if (now >= adjustedSunset) return 100;

  const totalDaylight = adjustedSunset - adjustedSunrise;
  const currentElapsed = now - adjustedSunrise;
  return Math.min(100, Math.max(0, Math.round((currentElapsed / totalDaylight) * 100)));
};
