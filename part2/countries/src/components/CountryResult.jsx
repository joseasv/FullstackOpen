import CountryDetails from "./CountryDetails";

const CountryResult = ({ result, onClickHandler }) => {
  //console.log("CountryResult", result);

  if (result.length === 0) {
    return <div>No matches found</div>;
  } else {
    if (result.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    } else {
      if (result.length === 1) {
        return <CountryDetails details={result[0]} />;
      } else {
        return result.map((country) => (
          <div key={country.cca3}>
            {country.name.common}{" "}
            <button onClick={() => onClickHandler(country)}>show</button>
          </div>
        ));
      }
    }
  }
};

export default CountryResult;