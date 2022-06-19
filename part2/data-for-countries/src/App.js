import axios from "axios";
import { useEffect, useState } from "react";
const API = process.env.REACT_APP_API_KEY;

const ShowCountry = ({ country }) => {
  const [temperature, setTemperature] = useState(0);
  const [wind, setWind] = useState(0);
  const [url, setUrl] = useState("");

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&units=metric&appid=${API}`
      )
      .then((response) => {
        setTemperature(response.data.main.temp);
        setWind(response.data.wind.speed);
        setUrl(
          `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        );
      });
  }, []);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>Languages :</h3>
      <ul>
        {Object.keys(country.languages).map((key) => {
          return <li key={key}>{country.languages[key]}</li>;
        })}
      </ul>
      <img src={country.flags.png} alt={country.name.common} />
      <h3>Weather in {country.capital[0]}</h3>
      <p>Temperature {temperature}</p>
      <img src={url} alt="" />
      <p>Wind speed {wind}</p>
    </div>
  );
};

const Countries = ({ show, setShow, countries }) => {
  const [country, setCountry] = useState("");

  if (countries.length === 0) {
    return;
  }

  if (countries.length > 10) {
    return <p>Too many countries please specify another filter</p>;
  } else if (countries.length < 10 && countries.length > 1) {
    return (
      <div>
        {!show ? (
          <div>
            {countries.map((country) => (
              <p key={country.cca2}>
                {country.name.common}{" "}
                <button
                  onClick={() => {
                    setShow(true);
                    setCountry(country);
                  }}
                >
                  show
                </button>
              </p>
            ))}
          </div>
        ) : (
          <ShowCountry country={country} />
        )}
      </div>
    );
  }
  return <ShowCountry country={countries[0]} />;
};

function App() {
  const [countries, setCountries] = useState([]);
  const [formValue, setFormValue] = useState("");
  const [listOfCountries, setListOfCountries] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      return setCountries(response.data);
    });
  }, []);

  const handleChange = (event) => {
    setFormValue(event.target.value);
    setListOfCountries(
      countries.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      )
    );
    setShow(false);
  };

  return (
    <div>
      {countries.length !== 0 ? (
        <p>
          find countries{" "}
          <input value={formValue} onChange={handleChange}></input>
        </p>
      ) : (
        <p>not loaded yet</p>
      )}
      <Countries countries={listOfCountries} show={show} setShow={setShow} />
    </div>
  );
}

export default App;
