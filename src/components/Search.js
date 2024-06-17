import React, { useState } from 'react';
import './Search.css';
const Search = ({ fetchWeather,setDegrees}) => {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('metric'); // default to Celsius

  const handleSubmit = (e) => {
    e.preventDefault();
    // fetchWeather(city);
    fetchWeather(city, unit);
    if(unit!=='metric')
      {
        setDegrees(false);
      }
      else
      {
        setDegrees(true);
      }
      setCity('');
    // setbtnclick(true);

  };
  

  return (
    <div className='container'>
      <h1 className="app-name">
          Weather App<span>🌤</span>
      </h1>
      <div className="search-bar">
      <form className='form' onSubmit={handleSubmit}>
        <input 
          className='city-search'
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Enter city name" 
          required 
        />
           <select 
          className='unit-select' 
          value={unit} 
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit</option>
        </select>
        <button className='submitbtn' type="submit">Search</button>
        
      </form>
      </div>

    </div>
    
  );
};

export default Search;