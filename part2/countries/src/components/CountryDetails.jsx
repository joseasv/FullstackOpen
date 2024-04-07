import { useState, useEffect } from "react";
import LanguageList from "./LanguageList";
import CapitalWeatherDetails from "./CapitalWeatherDetails";
import weatherService from "../services/OpenWeather";

const CountryDetails = ({ details }) => {
  //console.log("CountryDetails", details);

  //   console.log("languages", languages);
  //   console.log(languages.map((language) => language[1]));
  const imageAlt = "Flag of " + details.name.common;
  //   console.log("imageAlt ", imageAlt);

  const mapStyle = {
    border: "1px solid #555",
  };

  const [newWeatherData, setNewWeatherData] = useState(null);

  useEffect(() => {
    //console.log("newLatLong effect", details.capitalInfo);
    if (details.capitalInfo) {
      const [lat, long] = details.capitalInfo.latlng;

      weatherService.getCurrentWeather(lat, long).then((weatherRes) => {
        //console.log(weatherRes);
        setNewWeatherData(weatherRes);
      });
    }
  }, []);

  return (
    <div>
      <h2>{details.name.common}</h2>
      <div>capital {details.capital}</div>
      <div>area {details.area}</div>
      <h3>languages:</h3>
      <LanguageList list={Object.entries(details.languages)} />
      <img style={mapStyle} src={details.flags.png} alt={imageAlt} />
      <h3>Weather in {details.capital}</h3>
      <CapitalWeatherDetails weatherData={newWeatherData} />
    </div>
  );
};

export default CountryDetails;