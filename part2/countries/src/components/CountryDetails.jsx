import LanguageList from "./LanguageList";

const CountryDetails = ({ details }) => {
  console.log("CountryDetails", details);
  const languages = Object.entries(details.languages);
  console.log("languages", languages);
  console.log(languages.map((language) => language[1]));
  const imageAlt = "Flag of " + details.name.common;
  console.log("imageAlt ", imageAlt);

  return (
    <div>
      <h2>{details.name.common}</h2>
      <div>capital {details.capital}</div>
      <div>area {details.area}</div>
      <h3>languages:</h3>
      <LanguageList list={Object.entries(details.languages)} />
      <img src={details.flags.png} alt={imageAlt} />
    </div>
  );
};

export default CountryDetails;