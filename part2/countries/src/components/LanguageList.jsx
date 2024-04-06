const LanguageList = ({ list }) => {
  return (
    <ul>
      {list.map((language) => (
        <li key={language[0]}>{language[1]}</li>
      ))}
    </ul>
  );
};

export default LanguageList;