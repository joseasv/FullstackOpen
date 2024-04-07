import { useState } from "react";
import SearchForm from "./components/SearchForm";
import countriesService from "./services/Countries";
import CountryResult from "./components/CountryResult";

function App() {
  const [countryQuery, setNewCountryQuery] = useState("");
  const [newCountries, setNewCountries] = useState([]);

  const executeQuery = (event) => {
    event.preventDefault();
    //     console.log("executeQuery ");

    if (countryQuery !== "") {
      //       console.log("not empty countryQuery");
      countriesService.getAll().then((countries) => {
        const filteredCountries = countries.filter((country) =>
          country.name.common.toLowerCase().includes(countryQuery),
        );
        //console.log("filteredCountries", filteredCountries);

        setNewCountries(filteredCountries);
      });
    }
  };

  const handleQueryChange = (event) => {
    //console.log("setNewCountryQuery", event.target.value.toLowerCase());

    setNewCountryQuery(event.target.value.toLowerCase());
  };

  const onClickShow = (country) => {
    setNewCountries([country]);
  };

  //console.log(newCountries);
  return (
    <div>
      <SearchForm
        onChangeHandler={handleQueryChange}
        onSubmitHandler={executeQuery}
        filter={countryQuery}
      />
      <CountryResult result={newCountries} onClickHandler={onClickShow} />
    </div>
  );
}

export default App;
