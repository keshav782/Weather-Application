import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import WeatherDisplay from "./components/WeatherDisplay";
import Favorites from "./components/Favorites";
import axios from "axios";
import Loader from "./components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import './App.css'


const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [forecast, setforecast] = useState([]);
  // const [btnclick, setbtnclick] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  const [degrees, setDegrees] = useState(true);

  function groupByDate(weatherData) {
    const groupedData = {};

    weatherData.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];

      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(entry);
    });

    return groupedData;
  }
  function findMinMaxTemperature(groupedData) {
    const minMaxTemperatures = {};

    for (const date in groupedData) {
      const temperatures = groupedData[date].map((entry) => entry.main.temp);
      const minTemp = Math.min(...temperatures);
      const maxTemp = Math.max(...temperatures);
      minMaxTemperatures[date] = { min: minTemp, max: maxTemp };
    }

    return minMaxTemperatures;
  }
    useEffect(() => {
     
      const cityname= localStorage.getItem("cityname");
      if(cityname){
      fetchWeather(cityname, "metric");
      }
    },[degrees])
   
  useEffect(() => {
    axios
      .get("http://localhost:3001/favorites")
      .then((response) => {
        setFavorites(response.data);
      })
      .catch((error) => console.error("Error fetching favorites:", error));

      const cityname = localStorage.getItem("cityname");
      if(cityname){
        fetchWeather(cityname,"metric");
      }
  }, []);

   const  fetchWeather = (city, unit) => {
    
    setloading(true);
    localStorage.setItem("cityname", city);
    const apiKey = "a037a56e3edebe9cc3b826de48a42634";
    console.log(apiKey); // Should log your API key

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
      )
      .then((response) => {
        setWeatherData(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setError(error.message);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`
      )
      .then((response) => {
        
        setError(null);
        const groupedByDate = groupByDate(response.data.list);

        const minMaxTemperatures = findMinMaxTemperature(groupedByDate);
        setforecast(minMaxTemperatures);
      })
      .catch((error) => {
        setError(error.message);
      });
    setloading(false);
  };
  const addFavorite = (city) => {
    axios
      .post("http://localhost:3001/favorites", { city })
      .then((response) => {
       
        setFavorites([...favorites, response.data]);
      })
      .catch((error) => console.error("Error adding favorite:", error));
  };

  const removeFavorite = (id) => {
    axios
      .delete(`http://localhost:3001/favorites/${id}`)
      .then(() => {
        const c = favorites.filter((fav) => fav.id !== id);
        setFavorites(c);
      })
      .catch((error) => console.error("Error favorite:", error));
  };
  
  
  return (
    <div className="main">
      <Search
        fetchWeather={fetchWeather}
        addFavorite={addFavorite}
        
        setDegrees={setDegrees}
      />

      {loading ? (
        <Loader />
      ) : error !== null ? (
        <>
          <br />
          <br />
          <span style={{display:"block", textAlign:"center"}}>
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ "font-size": "20px" }}> Sorry, City not found</span>
          </span>
        </>
      ) : (
        weatherData && (
          <WeatherDisplay
            weatherData={weatherData}
            forecast={forecast}
            addFavorite={addFavorite}
            favorites={favorites}
            degrees={degrees}
          />
        )
      )}

      {
        favorites.length > 0 && (
          <Favorites
          favorites={favorites}
          fetchWeather={fetchWeather}
          removeFavorite={removeFavorite}
          
        />
        )
      }
      
    </div>
  );
};

export default App;