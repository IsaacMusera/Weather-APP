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
        setForecastData(forecastResponse.data.list.filter((_, index) => index % 8 === 0)); // Get daily forecasts
        setError("");
      } catch (err) {
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
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode", !isDarkMode); // Update body class for global styling
  };

  const toggleAbout = () => {
    setIsAboutVisible((prev) => !prev); // Toggle visibility of the about section
  };

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
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
        <button className="toggle-mode" onClick={toggleDarkMode}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button className="about-toggle" onClick={toggleAbout}>
          {isAboutVisible ? "Hide About" : "About"}
        </button>
      </header>

      {isAboutVisible && (
        <div className="about-section">
          <h3>About This App</h3>
          <p>
            Welcome to the Weather App, built by none other than Isaac – the best of the bestest! With this app, you can effortlessly check the weather in cities around the globe and access a 5-day forecast, powered by the OpenWeatherMap API.
          </p>
          <p>
            Isaac, the genius behind this app, has crafted an experience that's both smooth and visually stunning. The interface is user-friendly, intuitive, and even lets you toggle between light and dark mode to suit your mood. 
          </p>
          <p>
            This app is just a glimpse into Isaac's endless talent and unwavering dedication to coding. You’re lucky to be using a product created by one of the best developers out there!
          </p>
          <p>
            Enjoy using the app, and keep an eye on Isaac’s future projects – they're destined to change the game!
          </p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-card">
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <div className="weather-icon">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
              alt="weather icon"
            />
          </div>
          <div className="weather-details">
            <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
            <p>{weatherData.weather[0].description}</p>
            <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
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
                    year: "numeric",
                  })}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt="weather icon"
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
