# 🌦️ SkyPulse — Weather Dashboard (Assignment 4)

A clean, modern, responsive, and production-ready Single Page Application (SPA) built with **React**, **Vite**, and **Tailwind CSS**, integrating with the **OpenWeatherMap Current Weather Data API**.

![SkyPulse Weather Dashboard](public/weather-icon.svg)

---

## 🚀 Features & Core Capabilities

### 1. 🔍 Search & Quick-Select Navigation
- **City Search**: Search for any city worldwide with instant submit via `Enter` key or search button.
- **Popular Cities Quick-Chips**: One-tap access to major global cities (**London**, **New York**, **Tokyo**, **Kolkata**, **Paris**, **Sydney**).
- **Recent Searches**: Automatically maintains a list of recently queried locations with single-click revisit and clear history options.
- **GPS Geolocation**: Detects the user's current coordinates using the browser's `navigator.geolocation` API and retrieves local weather automatically.

### 2. 📊 Weather Metrics & Conditions Display
- **Temperature Display**: Real-time ambient temperature with an instant toggle between **Celsius (°C)** and **Fahrenheit (°F)**.
- **High / Low & Feels-Like**: Temperature range and thermal perception index.
- **Atmospheric Humidity**: Real-time humidity percentage with comfort level classification (Dry, Optimal, Humid) and visual progress bar.
- **Wind Speed & Direction**: Real-time wind speed in both **km/h** and **m/s**, with cardinal compass bearing and degrees.
- **Official OpenWeatherMap Icons**: High-resolution `@4x` official weather condition iconography with graceful SVG fallbacks.
- **Daylight & Sun Schedule**: Dynamic local sunrise and sunset timestamps formatted in clean local 12-hour time (`hh:mm AM/PM`), accompanied by a live daylight elapsed progress arc.
- **Additional Telemetry**: Atmospheric pressure (hPa), visibility distance (km), and percentage cloud cover.

### 3. 🎨 Dynamic UX & Adaptive Atmosphere
- **Weather-Adaptive Gradients**: Dynamic visual backgrounds that transition based on the city's live weather condition (Clear Day/Night, Rain, Thunderstorm, Snow, Clouds, Mist/Fog).
- **Glassmorphism Design**: Frosted glass panels with subtle ambient glows, responsive hover elevations, and clean typography (`Plus Jakarta Sans`).
- **Mobile-First Layout**:
  - **Mobile (≤ 768px)**: Centered single-column layout, compact weather card, full-width search input, and 2x2 responsive metrics grid.
  - **Tablet/Desktop**: Wide multi-column layout with 4-column metrics grid and ambient lighting.

### 4. 🛡️ Robust Error Handling & API Key Flexibility
- **Centered Loading Spinner**: Modern glowing spinner with skeleton bars during asynchronous requests.
- **Clear Error Banners**: Contextual banners for invalid city names (404), unactivated API keys (401), rate limits (429), or network offline conditions with a **Retry** mechanism.
- **API Key Configuration Drawer**:
  - Set your custom OpenWeatherMap API key at runtime (stored securely in browser `localStorage`).
  - Or configure via `.env` (`VITE_OPENWEATHER_API_KEY`).
  - Inline "Test Key" feature to validate keys against the OpenWeatherMap API with 1-click feedback.
  - **Simulated Demo Mode**: Toggle realistic offline simulated telemetry for seamless evaluation even without an active key or internet.

---

## 🛠️ Tech Stack & Implementation Details

- **React 19** (`useState`, `useEffect`, `useCallback`, cleanup patterns)
- **Vite 8** with Lightning Fast Hot Module Replacement (HMR)
- **Tailwind CSS v4** (`@tailwindcss/vite`) with custom glassmorphism utilities
- **Lucide React** for modern vector icons
- **OpenWeatherMap API**: Current Weather Data endpoint (`https://api.openweathermap.org/data/2.5/weather`)

---

## 📁 Clean Folder Structure

```
assignment-4/
├── public/
│   └── weather-icon.svg         # Custom SVG favicon
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.jsx      # API key settings drawer with validation test
│   │   ├── ErrorMessage.jsx     # Actionable error banners with retry triggers
│   │   ├── Header.jsx           # App header, °C/°F toggle, GPS button, API key trigger
│   │   ├── LoadingSpinner.jsx   # Centered loading state with ambient pulse
│   │   ├── SearchBar.jsx        # Search input, popular city chips, recent searches
│   │   ├── SunTracker.jsx       # Sunrise/sunset timetable & daylight progress arc
│   │   ├── WeatherCard.jsx      # Primary compact weather card with high-res icon
│   │   └── WeatherMetrics.jsx   # Responsive 2x2 / 4-col metrics telemetry grid
│   ├── services/
│   │   └── weatherService.js    # API calls with fetch(), async/await, key resolution
│   ├── utils/
│   │   └── weatherUtils.js      # °C/°F conversions, timezone time formatting, dynamic themes
│   ├── App.jsx                  # Root state management & layout coordination
│   ├── index.css                # Tailwind CSS v4 styling & glassmorphism classes
│   └── main.jsx                 # React root mount
├── .env.example                 # Environment variable template
├── .gitignore                   # Includes node_modules, dist, .env, and local configs
├── package.json
└── vite.config.js
```

---

## 🚦 Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. (Optional) Configure API Key in `.env`
Create a `.env` file from `.env.example`:
```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```
> *Note: You can also enter and test your API key directly inside the app using the **API Key** button in the header.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```
