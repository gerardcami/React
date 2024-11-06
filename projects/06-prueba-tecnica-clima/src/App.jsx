import { useCallback, useEffect, useReducer, useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "651f532994cdb08d22c53ecea00b531b";

// Custom hook para almacenar el término que estamos buscando en el
// localStorage y recuperarlo cada vez que usamos la aplicación.
const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

function App() {
  const weatherDataReducer = (state, action) => {
    switch (action.type) {
      case "DATA_FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "DATA_FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "DATA_FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        return state;
    }
  };

  const [searchTerm, setSearchTerm] = useStorageState("search", "Barcelona");

  // gestionar todas las variables de estado que
  // estén relacionadas entre si.
  const [weatherData, dispatchWeatherData] = useReducer(weatherDataReducer, {
    data: null,
    isloading: false,
    isError: false,
  });

  const fetchWeatherData = useCallback(async () => {
    dispatchWeatherData({ type: "DATA_FETCH_INIT" });
    try {
      // Obtener geolocalización de la ciudad
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=1&appid=${API_KEY}`
      );
      const { lat, lon } = geoResponse.data[0];

      // Hacer la llamada a la API de clima usando latitud y longitud
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      dispatchWeatherData({
        type: "DATA_FETCH_SUCCESS",
        payload: weatherResponse.data.main,
      });
    } catch {
      dispatchWeatherData({ type: "DATA_FETCH_FAILURE" });
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = useCallback(
    (event) => {
      fetchWeatherData();
      event.preventDefault();
    },
    [fetchWeatherData]
  );

  return (
    <>
      <h1>Prueba técnica: API tiempo</h1>
      <hr />
      <form onSubmit={handleSearchSubmit}>
        <label htmlFor="search">Consulta el clima por ciudad: </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleSearchInput}
        />
        <button type="submit" disabled={!searchTerm}>
          Consultar
        </button>
      </form>

      <div>
        <h2>Resultados:</h2>
        {weatherData.isError ? (
          <p>Error al obtener los datos.</p>
        ) : weatherData.isLoading ? (
          <p>Cargando...</p>
        ) : (
          weatherData.data && (
            <>
              <p>Temperatura: {weatherData.data.temp} °C</p>
              <p>Humedad: {weatherData.data.humidity} %</p>
            </>
          )
        )}
      </div>
    </>
  );
}

export default App;
