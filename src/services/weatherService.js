/**
 * Weather Service for OpenWeatherMap Current Weather API Integration
 * Handles API calls with fetch() and async/await, API key resolution,
 * error categorization, and graceful fallback support.
 */

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Default public demonstration fallback key
// Users can override this anytime via the Settings Drawer or VITE_OPENWEATHER_API_KEY in .env
export const DEFAULT_API_KEY = '20a066a33a5fae8006bf01b5042fb18d';

/**
 * Retrieve the active API key with precedence:
 * 1. User saved custom key from localStorage
 * 2. Vite environment variable: VITE_OPENWEATHER_API_KEY
 * 3. Default fallback key
 */
export const getActiveApiKey = () => {
  const customKey = localStorage.getItem('skyPulse_custom_api_key');
  if (customKey && customKey.trim().length > 0) {
    return customKey.trim();
  }
  if (import.meta.env.VITE_OPENWEATHER_API_KEY && import.meta.env.VITE_OPENWEATHER_API_KEY.trim()) {
    return import.meta.env.VITE_OPENWEATHER_API_KEY.trim();
  }
  return DEFAULT_API_KEY;
};

/**
 * Save user custom API key to localStorage
 */
export const saveCustomApiKey = (key) => {
  if (!key || key.trim() === '') {
    localStorage.removeItem('skyPulse_custom_api_key');
  } else {
    localStorage.setItem('skyPulse_custom_api_key', key.trim());
  }
};

/**
 * Reset API key to default
 */
export const resetCustomApiKey = () => {
  localStorage.removeItem('skyPulse_custom_api_key');
};

/**
 * Fetch Current Weather Data by City Name using fetch() and async/await
 * @param {string} city - City name (e.g., "London", "Tokyo", "Kolkata")
 * @param {string} [apiKey] - Optional explicit API key
 * @returns {Promise<object>} Parsed weather data
 */
export const fetchWeatherByCity = async (city, apiKey = null) => {
  if (!city || !city.trim()) {
    throw new Error('Please enter a valid city name.');
  }

  const key = apiKey || getActiveApiKey();
  const url = `${BASE_URL}?q=${encodeURIComponent(city.trim())}&units=metric&appid=${key}`;

  return executeWeatherRequest(url, city.trim());
};

/**
 * Fetch Current Weather Data by Coordinates (Geolocation)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} [apiKey] - Optional explicit API key
 * @returns {Promise<object>} Parsed weather data
 */
export const fetchWeatherByCoords = async (lat, lon, apiKey = null) => {
  const key = apiKey || getActiveApiKey();
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

  return executeWeatherRequest(url, `Coordinates (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
};

/**
 * Internal executor function for fetch requests with detailed error handling
 */
const executeWeatherRequest = async (url, targetLabel) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${targetLabel}" was not found. Please check spelling.`);
      }
      if (response.status === 401) {
        const error = new Error('Invalid or unactivated API key. OpenWeatherMap keys may take up to 2 hours to activate after creation.');
        error.isApiKeyError = true;
        throw error;
      }
      if (response.status === 429) {
        throw new Error('OpenWeatherMap API rate limit exceeded. Please wait a minute and retry.');
      }
      throw new Error(data.message || `Failed to fetch weather data (Status ${response.status}).`);
    }

    return {
      data,
      isSimulated: false,
    };
  } catch (error) {
    // If it's a TypeError from fetch, it is a network connection failure
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netError = new Error('Network failure: Unable to reach OpenWeatherMap servers. Please check your internet connection.');
      netError.isNetworkError = true;
      throw netError;
    }
    throw error;
  }
};

/**
 * Curated realistic mock weather data generator for offline testing or fallback
 */
const MOCK_CITY_DATABASE = {
  london: {
    name: 'London',
    country: 'GB',
    temp: 14,
    feels_like: 13,
    temp_min: 11,
    temp_max: 16,
    humidity: 78,
    wind_speed: 4.8, // m/s
    wind_deg: 240,
    pressure: 1014,
    visibility: 10000,
    clouds: 75,
    weather: [{ id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' }],
    timezone: 3600, // UTC+1
  },
  'new york': {
    name: 'New York',
    country: 'US',
    temp: 21,
    feels_like: 22,
    temp_min: 18,
    temp_max: 24,
    humidity: 56,
    wind_speed: 3.6,
    wind_deg: 180,
    pressure: 1018,
    visibility: 10000,
    clouds: 10,
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    timezone: -14400, // UTC-4
  },
  tokyo: {
    name: 'Tokyo',
    country: 'JP',
    temp: 18,
    feels_like: 17,
    temp_min: 15,
    temp_max: 20,
    humidity: 65,
    wind_speed: 5.2,
    wind_deg: 120,
    pressure: 1020,
    visibility: 9000,
    clouds: 40,
    weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
    timezone: 32400, // UTC+9
  },
  kolkata: {
    name: 'Kolkata',
    country: 'IN',
    temp: 31,
    feels_like: 36,
    temp_min: 27,
    temp_max: 34,
    humidity: 82,
    wind_speed: 2.8,
    wind_deg: 190,
    pressure: 1008,
    visibility: 6000,
    clouds: 60,
    weather: [{ id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' }],
    timezone: 19800, // UTC+5:30
  },
  paris: {
    name: 'Paris',
    country: 'FR',
    temp: 16,
    feels_like: 15,
    temp_min: 12,
    temp_max: 18,
    humidity: 70,
    wind_speed: 3.1,
    wind_deg: 210,
    pressure: 1016,
    visibility: 10000,
    clouds: 20,
    weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
    timezone: 7200, // UTC+2
  },
  sydney: {
    name: 'Sydney',
    country: 'AU',
    temp: 22,
    feels_like: 21,
    temp_min: 19,
    temp_max: 25,
    humidity: 62,
    wind_speed: 6.4,
    wind_deg: 90,
    pressure: 1022,
    visibility: 10000,
    clouds: 15,
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    timezone: 36000, // UTC+10
  },
};

/**
 * Returns a high-fidelity simulated response for seamless offline evaluation
 */
export const getSimulatedWeatherData = (cityName) => {
  const normalized = cityName.toLowerCase().trim();
  const mockCity = MOCK_CITY_DATABASE[normalized] || {
    name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
    country: 'World',
    temp: 24,
    feels_like: 25,
    temp_min: 20,
    temp_max: 27,
    humidity: 60,
    wind_speed: 4.0,
    wind_deg: 180,
    pressure: 1013,
    visibility: 10000,
    clouds: 30,
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    timezone: 0,
  };

  const nowSeconds = Math.floor(Date.now() / 1000);
  const sunrise = nowSeconds - 14400; // 4 hours ago
  const sunset = nowSeconds + 21600;  // 6 hours from now

  return {
    data: {
      id: Math.floor(Math.random() * 100000),
      name: mockCity.name,
      sys: {
        country: mockCity.country,
        sunrise,
        sunset,
      },
      coord: { lat: 51.5, lon: -0.12 },
      main: {
        temp: mockCity.temp,
        feels_like: mockCity.feels_like,
        temp_min: mockCity.temp_min,
        temp_max: mockCity.temp_max,
        humidity: mockCity.humidity,
        pressure: mockCity.pressure,
      },
      wind: {
        speed: mockCity.wind_speed,
        deg: mockCity.wind_deg,
      },
      visibility: mockCity.visibility,
      clouds: {
        all: mockCity.clouds,
      },
      weather: mockCity.weather,
      timezone: mockCity.timezone,
      dt: nowSeconds,
    },
    isSimulated: true,
  };
};
