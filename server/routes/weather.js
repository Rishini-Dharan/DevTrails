const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY || 'demo';

const CITY_COORDS = {
  mumbai: { lat: 19.076, lon: 72.8777 },
  delhi: { lat: 28.6139, lon: 77.209 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  pune: { lat: 18.5204, lon: 73.8567 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
};

// GET /api/weather/:city
router.get('/:city', async (req, res) => {
  const city = req.params.city.toLowerCase();
  const coords = CITY_COORDS[city];

  if (!coords) {
    return res.status(400).json({ error: `Unknown city. Available: ${Object.keys(CITY_COORDS).join(', ')}` });
  }

  // If no real API key, return simulated data
  if (API_KEY === 'demo') {
    return res.json(getSimulatedWeather(city));
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { lat: coords.lat, lon: coords.lon, appid: API_KEY, units: 'metric' },
    });

    const data = response.data;
    res.json({
      city,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      precipitation: data.rain ? data.rain['1h'] || 0 : 0,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      aqi: Math.floor(Math.random() * 200) + 50, // Simulated AQI
      timestamp: new Date().toISOString(),
      source: 'OpenWeatherMap',
    });
  } catch (err) {
    // Fallback to simulated data
    res.json(getSimulatedWeather(city));
  }
});

function getSimulatedWeather(city) {
  const month = new Date().getMonth();
  const isMonsoon = month >= 5 && month <= 8;
  const isSummer = month >= 3 && month <= 5;
  const isWinter = month >= 10 || month <= 1;

  return {
    city,
    temperature: isSummer ? 38 + Math.random() * 8 : isWinter ? 12 + Math.random() * 10 : 25 + Math.random() * 8,
    feelsLike: isSummer ? 42 + Math.random() * 5 : 20 + Math.random() * 8,
    humidity: isMonsoon ? 80 + Math.random() * 15 : 40 + Math.random() * 30,
    precipitation: isMonsoon ? Math.random() * 50 + 10 : Math.random() * 5,
    windSpeed: 5 + Math.random() * 15,
    description: isMonsoon ? 'heavy rain' : isSummer ? 'clear sky, extreme heat' : 'partly cloudy',
    icon: isMonsoon ? '10d' : isSummer ? '01d' : '02d',
    aqi: isWinter && (city === 'delhi') ? 350 + Math.random() * 150 : 80 + Math.random() * 120,
    timestamp: new Date().toISOString(),
    source: 'Simulated',
  };
}

module.exports = router;
