import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState("Berlin");
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [time, setTime] = useState("");

  const API_KEY = "b4dc84fc8940b8b46cdb18bda17cf579";

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        setWeatherData(weatherResponse.data);
        setForecastData(forecastResponse.data.list.filter((_, i) => i % 8 === 0));
        setError("");
      } catch {
        setError("City not found. Please try again.");
        setWeatherData(null);
        setForecastData([]);
      }
    };

    fetchWeather();
  }, [city]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";

      const formattedTime = `${(hours % 12 || 12)
        .toString()
        .padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")} ${ampm}`;

      setTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity);
      setSearchCity("");
    }
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleAbout = () => setIsAboutVisible((prev) => !prev);

  const getWeatherClass = () => {
    if (!weatherData) return "";
    const main = weatherData.weather[0].main.toLowerCase();
    if (main.includes("cloud")) return "cloudy";
    if (main.includes("rain") || main.includes("drizzle")) return "rainy";
    if (main.includes("snow")) return "snowy";
    if (main.includes("thunder")) return "stormy";
    if (main.includes("clear")) return "sunny";
    return "default-weather";
  };

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"} ${getWeatherClass()}`}>
      {/* HEADER */}
      <header className="header">
        <h1>Weather App</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Search city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="header-buttons">
          <button onClick={toggleDarkMode}>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={toggleAbout}>
            {isAboutVisible ? "Hide About" : "About"}
          </button>
        </div>
      </header>

      {/* CURRENT TIME */}
      <div className="time">{time}</div>

      {/* ABOUT */}
      {isAboutVisible && (
        <div className="about-section">
          <h3>About This App</h3>
          <p>
            This Weather App lets you search any city and see live weather with a
            5-day forecast, animations, and live time.
          </p>
        </div>
      )}

      {/* ERROR */}
      {error && <p className="error">{error}</p>}

      {/* CURRENT WEATHER */}
      {weatherData && (
        <div className="weather-card">
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>

          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt="weather"
            className="weather-icon"
          />

          <p className="temperature">
            {Math.round(weatherData.main.temp)}°C
          </p>

          <p>{weatherData.weather[0].description}</p>
          <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind: {weatherData.wind.speed} m/s</p>
        </div>
      )}

      {/* FORECAST */}
      {forecastData.length > 0 && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>

          <div className="forecast-container">
            {forecastData.map((forecast, i) => {
              const date = new Date(forecast.dt * 1000);

              const day = date.toLocaleDateString("en-US", {
                weekday: "long",
              });

              const time = date.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={i} className="forecast-card">
                  <p className="forecast-day">{day}</p>
                  <p className="forecast-time">{time}</p>

                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt="icon"
                  />

                  <p>{Math.round(forecast.main.temp)}°C</p>
                  <p>{forecast.weather[0].description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;