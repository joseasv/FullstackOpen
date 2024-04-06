const CountryList = ({ list }) => {
  console.log("CountryList", list);
  return list.map((country) => (
    <div key={country.cca3}>{country.name.common}</div>
  ));
};

export default CountryList;