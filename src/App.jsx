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

  const API_KEY = "b4dc84fc8940b8b46cdb18bda17cf579";

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
        setForecastData(
          forecastResponse.data.list.filter((_, index) => index % 8 === 0)
        );
        setError("");
      } catch {
        setError("City not found. Please try again.");
        setWeatherData(null);
        setForecastData([]);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity);
      setSearchCity("");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleAbout = () => {
    setIsAboutVisible((prev) => !prev);
  };

  // ✅ MUST BE INSIDE App
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
      {/* Weather animations */}
  <div className="sun"></div>
  <div className="clouds"></div>
  <div className="rain"></div>
  <div className="snow"></div> 
      <header className="header">
        <h1>Weather App</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Search for a city"
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

      {isAboutVisible && (
        <div className="about-section">
          <h3>About This App</h3>
          <p>
            This Weather App lets you search any city and see live weather with a
            5-day forecast.
          </p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-card">
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>

          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt="weather"
          />

          <p className="temperature">
            {Math.round(weatherData.main.temp)}°C
          </p>

          <p>
            {weatherData.weather[0].description}{" "}
            {weatherData.weather[0].main === "Clear" && "☀️"}
            {weatherData.weather[0].main === "Clouds" && "☁️"}
            {weatherData.weather[0].main === "Rain" && "🌧"}
            {weatherData.weather[0].main === "Snow" && "❄️"}
            {weatherData.weather[0].main === "Thunderstorm" && "⛈"}
          </p>

          <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind: {weatherData.wind.speed} m/s</p>
        </div>
      )}

      {forecastData.length > 0 && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>

          <div className="forecast-container">
            {forecastData.map((forecast, index) => (
              <div key={index} className="forecast-card">
                <p>
                  {new Date(forecast.dt * 1000).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>

                <img
                  src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt="icon"
                />

                <p>{Math.round(forecast.main.temp)}°C</p>
                <p>{forecast.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;