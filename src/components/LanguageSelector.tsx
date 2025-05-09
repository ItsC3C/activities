import { useLanguage } from "../context/LanguageContext";

const LanguageSelector = () => {
  const { language } = useLanguage();
  return (
    <div>
      <h1>Taal: {language}</h1>
    </div>
  );
};
export default LanguageSelector;
