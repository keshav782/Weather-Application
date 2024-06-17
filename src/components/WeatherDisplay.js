import React from "react";
import "./WeatherDisplay.css";
const WeatherDisplay = ({
  weatherData,
  forecast,
  addFavorite,
  favorites,
  degrees,
}) => {
  const handleAddFavorite = () => {
    alert("Added to favorites");
    addFavorite(weatherData.name);
  };
  const checkFavorite = (city) => {
    
    return favorites.some((fav) => fav.city === city);
  };
  
  return (
    <>
      <div>
        <div className="city-name">
          <h2>
            {weatherData.name}, <span>{weatherData.sys.country}</span>
            {checkFavorite(weatherData.name) ? null : (
              <button className="addbtn" onClick={handleAddFavorite}>
                Favorites
              </button>
            )}
          </h2>
        </div>
        <div className="date">{/* <span>{toDate()}</span> */}</div>
        <div className="icon-temp">
          <img
            className=""
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
          {Math.round(weatherData.main.temp)}
          {degrees ? (
            <sup className="deg">&deg;C</sup>
          ) : (
            <sup className="deg">&deg;F</sup>
          )}
        </div>
        <div className="des-wind">
          <p>{weatherData.weather[0].description.toUpperCase()}</p>
          <p>Wind Speed: {weatherData.wind.speed}m/s</p>
        </div>
      </div>
      <div className="forecast">
        {Object.entries(forecast)
          .slice(0, 5)
          .map(([date, temperatures]) => {
            return (
              <div key={date}>
                <p>Date: {date}</p>
                {degrees ? (
                  <>
                    <p>Max Temp: {temperatures.max}°C</p>
                    <p>Min Temp: {temperatures.min}°C</p>
                  </>
                ) : (
                  <>
                    <p>Max Temp: {temperatures.max}°F</p>
                    <p>Min Temp: {temperatures.max}°F</p>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default WeatherDisplay;