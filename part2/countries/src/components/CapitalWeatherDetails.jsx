const CapitalWeatherDetails = ({ weatherData }) => {
  if (weatherData) {
    //console.log("weatherData", weatherData);
    //console.log("icon", weatherData.weather[0].icon);
    const iconURL = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    //console.log("iconURL", iconURL);
    const iconStyle = {
      border: "1px solid #555",
    };
    return (
      <>
        <div>temperature {weatherData.main.temp} Celsius</div>
        <img
          style={iconStyle}
          src={iconURL}
          alt={weatherData.weather[0].description}
        />
        <div>wind {weatherData.wind.speed} m/s</div>
      </>
    );
  }
};

export default CapitalWeatherDetails;