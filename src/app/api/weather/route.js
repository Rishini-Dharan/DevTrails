import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY || 'demo';

// City coordinates for OpenWeatherMap
const CITY_COORDS = {
  BLR: { lat: 12.9716, lon: 77.5946, name: 'Bengaluru' },
  MUM: { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
  DEL: { lat: 28.6139, lon: 77.2090, name: 'Delhi' },
  HYD: { lat: 17.3850, lon: 78.4867, name: 'Hyderabad' },
  CHN: { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
};

async function fetchRealWeather(cityId) {
  const coords = CITY_COORDS[cityId];
  if (!coords) return null;

  // Try real API first
  if (API_KEY && API_KEY !== 'demo') {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`,
        { next: { revalidate: 900 } } // Cache 15 minutes
      );
      if (res.ok) {
        const data = await res.json();
        return {
          city: cityId,
          cityName: coords.name,
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          precipitation: data.rain ? Math.round(data.rain['1h'] || 0) : 0,
          windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
          condition: data.weather[0]?.main || 'Unknown',
          description: data.weather[0]?.description || '',
          icon: data.weather[0]?.icon || '01d',
          pressure: data.main.pressure,
          visibility: Math.round((data.visibility || 10000) / 1000),
          source: 'openweathermap',
          updatedAt: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.error('OpenWeatherMap API error:', e.message);
    }
  }

  // Fallback: realistic simulated data based on city climate patterns
  const month = new Date().getMonth();
  const hour = new Date().getHours();
  
  const climateProfiles = {
    BLR: { baseTemp: 28, rainProb: month >= 5 && month <= 9 ? 0.5 : 0.15, baseAqi: 80 },
    MUM: { baseTemp: 30, rainProb: month >= 5 && month <= 9 ? 0.7 : 0.05, baseAqi: 120 },
    DEL: { baseTemp: month >= 3 && month <= 5 ? 40 : 25, rainProb: month >= 6 && month <= 8 ? 0.4 : 0.05, baseAqi: month >= 10 && month <= 1 ? 380 : 150 },
    HYD: { baseTemp: 32, rainProb: month >= 6 && month <= 9 ? 0.4 : 0.1, baseAqi: 100 },
    CHN: { baseTemp: 33, rainProb: month >= 9 && month <= 11 ? 0.5 : 0.1, baseAqi: 90 },
  };

  const profile = climateProfiles[cityId] || climateProfiles.BLR;
  const tempVariation = Math.sin(hour / 24 * Math.PI) * 6; // Day/night cycle
  const isRaining = Math.random() < profile.rainProb;
  const conditions = isRaining 
    ? ['Light Rain', 'Moderate Rain', 'Heavy Rain', 'Thunderstorm']
    : ['Clear', 'Partly Cloudy', 'Overcast', 'Haze'];

  return {
    city: cityId,
    cityName: coords.name,
    temperature: Math.round(profile.baseTemp + tempVariation + (Math.random() * 4 - 2)),
    feelsLike: Math.round(profile.baseTemp + tempVariation + 3),
    humidity: Math.floor(Math.random() * 30 + (isRaining ? 70 : 40)),
    precipitation: isRaining ? Math.floor(Math.random() * 60 + 5) : 0,
    windSpeed: Math.floor(Math.random() * 20 + 5),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    description: isRaining ? 'rain expected in the area' : 'generally clear skies',
    pressure: Math.floor(Math.random() * 20 + 1005),
    visibility: isRaining ? Math.floor(Math.random() * 5 + 2) : 10,
    source: 'simulation',
    updatedAt: new Date().toISOString(),
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (city) {
    const weather = await fetchRealWeather(city);
    if (!weather) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }
    return NextResponse.json(weather);
  }

  // Return all cities
  const allWeather = await Promise.all(
    Object.keys(CITY_COORDS).map(id => fetchRealWeather(id))
  );

  return NextResponse.json(allWeather);
}
