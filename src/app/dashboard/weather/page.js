'use client';
import { useState, useEffect } from 'react';
import { CITIES, TRIGGER_TYPES } from '../../../core/data';

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState({});
  const [selectedCity, setSelectedCity] = useState('BLR');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchWeather = async () => {
    try {
      const res = await fetch('/api/weather');
      const data = await res.json();
      const mapped = {};
      data.forEach(w => { mapped[w.city] = w; });
      setWeatherData(mapped);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Weather fetch failed:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 15000);
    return () => clearInterval(interval);
  }, []);

  const currentWeather = weatherData[selectedCity];

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Live Conditions</h1>
          <p className="text-muted text-sm mt-2">
            Real-time monitoring across all coverage zones
            {currentWeather?.source === 'openweathermap' && (
              <span className="badge badge-primary" style={{ marginLeft: '8px' }}>Live API</span>
            )}
            {currentWeather?.source === 'simulation' && (
              <span className="badge badge-warning" style={{ marginLeft: '8px' }}>Simulated</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="live-dot"></span>
          <span className="text-sm text-muted">
            {lastUpdate ? `Updated ${lastUpdate}` : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* City selector */}
      <div className="flex gap-2 mb-6" style={{ flexWrap: 'wrap' }}>
        {CITIES.map(c => {
          const w = weatherData[c.id];
          const hasAlert = w && (w.temperature > 44 || w.precipitation > 30 || (w.aqi && w.aqi > 400));
          return (
            <button
              key={c.id}
              className={`btn ${selectedCity === c.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCity(c.id)}
              style={{ fontSize: '0.8125rem', position: 'relative' }}
            >
              {c.name}
              {hasAlert && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'var(--accent-danger)',
                  animation: 'pulse-ring 1.5s ease-out infinite',
                }}></span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px' }}></div>)}
        </div>
      ) : currentWeather && (
        <>
          {/* Current conditions */}
          <div className="grid-4 mb-6">
            {[
              { label: 'Temperature', value: `${currentWeather.temperature}°C`, icon: '🌡️', warn: currentWeather.temperature > 44, sub: currentWeather.feelsLike ? `Feels like ${currentWeather.feelsLike}°C` : null },
              { label: 'Precipitation', value: `${currentWeather.precipitation} mm/hr`, icon: '🌧️', warn: currentWeather.precipitation > 30, sub: currentWeather.condition },
              { label: 'Humidity', value: `${currentWeather.humidity}%`, icon: '💧', warn: false, sub: `Visibility: ${currentWeather.visibility || '—'}km` },
              { label: 'Wind Speed', value: `${currentWeather.windSpeed} km/h`, icon: '💨', warn: currentWeather.windSpeed > 50, sub: `Pressure: ${currentWeather.pressure || '—'} hPa` },
            ].map((m, i) => (
              <div key={i} className={`card animate-fade-in ${m.warn ? '' : ''}`} style={{
                animationDelay: `${i * 0.05}s`, opacity: 0,
                borderColor: m.warn ? 'var(--accent-danger)' : undefined,
                background: m.warn ? 'var(--accent-danger-glow)' : undefined,
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: '1.25rem' }}>{m.icon}</span>
                  <span className="stat-label">{m.label}</span>
                </div>
                <div className="stat-value" style={{
                  color: m.warn ? 'var(--accent-danger)' : 'var(--text-primary)',
                  fontSize: '1.5rem'
                }}>
                  {m.value}
                </div>
                {m.sub && <div className="text-xs text-muted mt-1">{m.sub}</div>}
                {m.warn && <span className="badge badge-danger mt-2">⚠ Threshold Breached</span>}
              </div>
            ))}
          </div>

          {/* All cities overview */}
          <div className="card mb-6">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>All Cities Overview</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Temp</th>
                    <th>Rain</th>
                    <th>Humidity</th>
                    <th>Wind</th>
                    <th>Condition</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CITIES.map(c => {
                    const w = weatherData[c.id];
                    if (!w) return null;
                    const hasAlert = w.temperature > 44 || w.precipitation > 30;
                    return (
                      <tr key={c.id} onClick={() => setSelectedCity(c.id)} style={{ cursor: 'pointer' }}>
                        <td style={{ fontWeight: selectedCity === c.id ? 700 : 400 }}>{c.name}</td>
                        <td className="font-mono" style={{ color: w.temperature > 44 ? 'var(--accent-danger)' : undefined }}>{w.temperature}°C</td>
                        <td className="font-mono" style={{ color: w.precipitation > 30 ? 'var(--accent-danger)' : undefined }}>{w.precipitation} mm/hr</td>
                        <td className="font-mono">{w.humidity}%</td>
                        <td className="font-mono">{w.windSpeed} km/h</td>
                        <td className="text-sm">{w.condition}</td>
                        <td>
                          <span className={`badge ${hasAlert ? 'badge-danger' : 'badge-success'}`}>
                            {hasAlert ? '⚠ Alert' : '✓ Normal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trigger Status */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Parametric Trigger Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TRIGGER_TYPES.map((t, i) => {
                const isActive = (
                  (t.id === 'TRG-RAIN' && currentWeather.precipitation > 30) ||
                  (t.id === 'TRG-HEAT' && currentWeather.temperature > 44) ||
                  (t.id === 'TRG-AQI' && currentWeather.aqi > 400)
                );
                return (
                  <div key={i} className="flex justify-between items-center" style={{
                    padding: '12px 16px', background: isActive ? 'var(--accent-danger-glow)' : 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: isActive ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
                    transition: 'all 0.3s ease',
                  }}>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '1.25rem' }}>{t.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                        <div className="text-xs text-muted font-mono">{t.threshold}</div>
                      </div>
                    </div>
                    <span className={`badge ${isActive ? 'badge-danger' : 'badge-success'}`}>
                      {isActive ? '🔴 TRIGGERED' : '🟢 Safe'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
