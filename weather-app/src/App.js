import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { MdLocationOn } from 'react-icons/md';

function App() {

  /*
  * Making the state variables
  * 1) City State
  * 2) weather API state
  * 3) Loading
  * 4) Error
  * 
  */
  const [userCity, setUserCity] = useState('');
  const [weatherAPI, setWeatherAPI] = useState(null);
  const [loadingScr, setLoadingScr] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  /*
  * Setting up the functions
  *
  * 1) useEffect for getting the API call
  *   - throws error if doesnt get data
  *   - calls in async to parallel with the page
  * 2) making the handlSearch for processing the API call
  * 3) getCurrentPosition
  *   - Takes the users input promising the geolocation
  * 
  */

  useEffect(() => {
    const getWeatherWithLocation = async () => {
      setLoadingScr(true);
      try {
        const position = await getCurrentPosition();
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=3f3f851a1da6945f92571858be32c63c&units=metric`;
        //calling axios as a runner for the data
        const response = await axios.get(url);
        setWeatherAPI(response.data);
        setLoadingScr(false);
        

      } catch (error) {
        setErrorMsg(errorMsg.message);
        setLoadingScr(false);
      }
    };
    if (!userCity) {
      getWeatherWithLocation();
    }
  }, [!userCity]);

  //makig the handling function
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoadingScr(true);
    setErrorMsg(null);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=3f3f851a1da6945f92571858be32c63c&units=metric`;
      //calling axios as a runner for the data
      const response = await axios.get(url);
      setWeatherAPI(response.data);
      setLoadingScr(false);
    } catch (error) {
      setErrorMsg(errorMsg.message);
      setLoadingScr(false);
    }
  };

  //getting the users position function
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <div className="App">
      <h1 id="handle">Personal Weather App</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder='Enter a City name'
          value={ userCity }
          onChange={ (e) => setUserCity(e.target.value)}  
        />
        <button type='submit' class = "weather-button" disabled={ !userCity && !weatherAPI}>
          Get Weather
        </button>
        {!userCity && !loadingScr && !errorMsg && (
          <button type="button" onClick={() => setUserCity('')}>
            <MdLocationOn /> Use my current MdLocationOn
          </button>
        )}
      </form>
      { loadingScr && <p>Loading info...</p> }
      { errorMsg && <p>{ errorMsg }</p>}
      {weatherAPI && (
        <div class="weather-info">

          <h2>{ weatherAPI.name }</h2>
          <p>Temperature: { weatherAPI.main.temp } C</p>
          <p>Humidity: { weatherAPI.main.humidity }%</p>
          <p>Description: { weatherAPI.weather[0].description }</p>
        </div>
      )}
    </div>
  );
}

export default App;
