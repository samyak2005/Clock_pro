import React, { useState, useEffect } from 'react';
import { WEATHER_API_KEY, WEATHER_BASE_URL, WEATHER_ICON_URL } from '../config';

function WorldClock() {
  const [worldClocks, setWorldClocks] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState({});

  const timezoneOptions = [
    { value: 'America/New_York', label: 'New York', city: 'New York', country: 'US' },
    { value: 'America/Los_Angeles', label: 'Los Angeles', city: 'Los Angeles', country: 'US' },
    { value: 'Europe/London', label: 'London', city: 'London', country: 'GB' },
    { value: 'Europe/Paris', label: 'Paris', city: 'Paris', country: 'FR' },
    { value: 'Asia/Tokyo', label: 'Tokyo', city: 'Tokyo', country: 'JP' },
    { value: 'Asia/Shanghai', label: 'Shanghai', city: 'Shanghai', country: 'CN' },
    { value: 'Australia/Sydney', label: 'Sydney', city: 'Sydney', country: 'AU' },
    { value: 'Asia/Dubai', label: 'Dubai', city: 'Dubai', country: 'AE' },
    { value: 'Asia/Mumbai', label: 'Mumbai', city: 'Mumbai', country: 'IN' },
    { value: 'Asia/Singapore', label: 'Singapore', city: 'Singapore', country: 'SG' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update times
      setWorldClocks(prev => [...prev]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch weather data for a city
  const fetchWeather = async (city, country) => {
    if (WEATHER_API_KEY === 'YOUR_API_KEY') {
      console.log('Please set up your weather API key in src/config.js');
      return;
    }

    const url = `${WEATHER_BASE_URL}?q=${city},${country}&appid=${WEATHER_API_KEY}&units=metric`;
    
    try {
      setLoading(prev => ({ ...prev, [city]: true }));
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeatherData(prev => ({
          ...prev,
          [city]: {
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
          }
        }));
      } else {
        console.error('Weather API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(prev => ({ ...prev, [city]: false }));
    }
  };

  const addTimezone = () => {
    if (!selectedTimezone) {
      alert('Please select a timezone');
      return;
    }

    if (worldClocks.some(clock => clock.timezone === selectedTimezone)) {
      alert('This timezone is already added');
      return;
    }

    const timezoneOption = timezoneOptions.find(option => option.value === selectedTimezone);
    const newClock = { 
      timezone: selectedTimezone, 
      city: timezoneOption.label,
      cityName: timezoneOption.city,
      country: timezoneOption.country
    };
    
    setWorldClocks(prev => [...prev, newClock]);
    
    // Fetch weather for the new city
    fetchWeather(timezoneOption.city, timezoneOption.country);
    
    setSelectedTimezone('');
  };

  const removeTimezone = (timezone) => {
    const clockToRemove = worldClocks.find(clock => clock.timezone === timezone);
    if (clockToRemove) {
      setWeatherData(prev => {
        const newData = { ...prev };
        delete newData[clockToRemove.cityName];
        return newData;
      });
    }
    setWorldClocks(prev => prev.filter(clock => clock.timezone !== timezone));
  };

  const getTimeInTimezone = (timezone) => {
    const now = new Date();
    const timeInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    
    const timeString = timeInTimezone.toLocaleTimeString('en-US', {
      hour12: false,
      timeZone: timezone
    });
    
    const dateString = timeInTimezone.toLocaleDateString('en-US', {
      timeZone: timezone
    });

    return { timeString, dateString };
  };

  const getWeatherIcon = (iconCode) => {
    return `${WEATHER_ICON_URL}${iconCode}@2x.png`;
  };

  const refreshWeather = (city, country) => {
    fetchWeather(city, country);
  };

  return (
    <div id="world-clock-container" className="section">
      <h1>World Clock & Weather</h1>
      <div className="world-clock-controls">
        <select
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
        >
          <option value="">Select a timezone</option>
          {timezoneOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button onClick={addTimezone}>Add Timezone</button>
      </div>
      
      <div id="world-clock-display">
        {worldClocks.length === 0 ? (
          <p style={{ color: '#dac1e9cd', fontSize: '18px' }}>
            No timezones added yet. Select a timezone and click "Add Timezone" to get started.
          </p>
        ) : (
          worldClocks.map(clock => {
            const { timeString, dateString } = getTimeInTimezone(clock.timezone);
            const weather = weatherData[clock.cityName];
            const isLoading = loading[clock.cityName];

            return (
              <div key={clock.timezone} className="world-clock-item">
                <div className="world-clock-header">
                  <div className="world-clock-city">{clock.city}</div>
                  <button 
                    onClick={() => removeTimezone(clock.timezone)}
                    className="remove-timezone"
                  >
                    ×
                  </button>
                </div>
                
                <div className="world-clock-time">{timeString}</div>
                <div className="world-clock-date">{dateString}</div>
                
                {/* Weather Section */}
                <div className="weather-section">
                  {isLoading ? (
                    <div className="weather-loading">Loading weather...</div>
                  ) : weather ? (
                    <div className="weather-info">
                      <div className="weather-main">
                        <img 
                          src={getWeatherIcon(weather.icon)} 
                          alt={weather.description}
                          className="weather-icon"
                        />
                        <div className="weather-details">
                          <div className="temperature">{weather.temperature}°C</div>
                          <div className="description">{weather.description}</div>
                        </div>
                      </div>
                      <div className="weather-extra">
                        <div>Humidity: {weather.humidity}%</div>
                        <div>Wind: {weather.windSpeed} m/s</div>
                      </div>
                      <button 
                        onClick={() => refreshWeather(clock.cityName, clock.country)}
                        className="refresh-weather"
                      >
                        ↻
                      </button>
                    </div>
                  ) : (
                    <div className="weather-placeholder">
                      <button 
                        onClick={() => fetchWeather(clock.cityName, clock.country)}
                        className="load-weather-btn"
                      >
                        Load Weather
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default WorldClock; 