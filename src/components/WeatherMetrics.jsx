import React from 'react';
import {
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  Cloud,
  Thermometer,
  Sunrise,
} from 'lucide-react';
import { formatTemp, formatWindSpeed, formatCityLocalTime } from '../utils/weatherUtils';

// Helper to convert wind degrees into 8-cardinal compass directions
const getWindDirection = (deg) => {
  if (deg === undefined || deg === null) return '';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

export default function WeatherMetrics({ weatherData, tempUnit }) {
  if (!weatherData) return null;

  const { main, wind, visibility, clouds, sys, timezone } = weatherData;

  const humidity = main?.humidity ?? 0;
  const windMps = wind?.speed ?? 0;
  const windKmh = formatWindSpeed(windMps, 'metric');
  const windDir = getWindDirection(wind?.deg);
  const pressure = main?.pressure ?? 1013;
  const visibilityKm = visibility ? (visibility / 1000).toFixed(1) : '--';
  const cloudCover = clouds?.all ?? 0;
  const sunriseTime = formatCityLocalTime(sys?.sunrise, timezone);
  const sunsetTime = formatCityLocalTime(sys?.sunset, timezone);

  // Comfort indicator for humidity
  const getHumidityStatus = (val) => {
    if (val < 30) return { label: 'Dry', color: 'text-amber-300' };
    if (val <= 60) return { label: 'Optimal', color: 'text-emerald-300' };
    return { label: 'Humid', color: 'text-cyan-300' };
  };

  const humidityStatus = getHumidityStatus(humidity);

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${humidity}%`,
      subtext: humidityStatus.label,
      subtextColor: humidityStatus.color,
      icon: Droplets,
      iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      progressBar: humidity,
      progressColor: 'bg-cyan-400',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: windKmh,
      subtext: `${windMps.toFixed(1)} m/s • ${windDir} (${wind?.deg ?? 0}°)`,
      subtextColor: 'text-sky-300',
      icon: Wind,
      iconBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      extraIcon: Compass,
      extraRotate: wind?.deg || 0,
    },
    {
      id: 'sunTimes',
      label: 'Sunrise / Sunset',
      value: `${sunriseTime}`,
      subtext: `Sunset: ${sunsetTime}`,
      subtextColor: 'text-amber-300',
      icon: Sunrise,
      iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'feelsLike',
      label: 'Feels Like',
      value: formatTemp(main?.feels_like, tempUnit),
      subtext: `Actual: ${formatTemp(main?.temp, tempUnit)}`,
      subtextColor: 'text-slate-300',
      icon: Thermometer,
      iconBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${pressure} hPa`,
      subtext: pressure > 1013 ? 'High Pressure' : 'Normal / Low',
      subtextColor: 'text-slate-300',
      icon: Gauge,
      iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: `${visibilityKm} km`,
      subtext: visibility >= 10000 ? 'Clear Visibility' : 'Hazy / Restricted',
      subtextColor: visibility >= 10000 ? 'text-emerald-300' : 'text-amber-300',
      icon: Eye,
      iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'clouds',
      label: 'Cloud Cover',
      value: `${cloudCover}%`,
      subtext: cloudCover > 70 ? 'Overcast' : cloudCover > 20 ? 'Partly Cloudy' : 'Clear Sky',
      subtextColor: 'text-slate-300',
      icon: Cloud,
      iconBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      progressBar: cloudCover,
      progressColor: 'bg-indigo-400',
    },
    {
      id: 'tempRange',
      label: 'Temp Range',
      value: `${formatTemp(main?.temp_min, tempUnit)} - ${formatTemp(main?.temp_max, tempUnit)}`,
      subtext: 'Daily High / Low',
      subtextColor: 'text-slate-300',
      icon: Thermometer,
      iconBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Weather Conditions & Detailed Metrics
        </h3>
        <span className="text-[11px] text-slate-400">Live Telemetry</span>
      </div>

      {/* Responsive Metrics Grid: 2x2 on mobile (<= 768px), 4 cols on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-white/15 relative overflow-hidden group"
            >
              {/* Header: Icon & Label */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-300 truncate">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl border ${item.iconBg} shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              {/* Metric Value */}
              <div className="my-1">
                <p className="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                  {item.value}
                </p>
                <p className={`text-[11px] font-medium truncate mt-0.5 ${item.subtextColor}`}>
                  {item.subtext}
                </p>
              </div>

              {/* Progress bar if applicable */}
              {item.progressBar !== undefined && (
                <div className="w-full h-1.5 bg-black/30 rounded-full mt-2 overflow-hidden border border-white/10">
                  <div
                    className={`h-full ${item.progressColor} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${item.progressBar}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
