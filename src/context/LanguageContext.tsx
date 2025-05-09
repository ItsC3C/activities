import { createContext, useContext } from "react";

type LanguageContextPropTypes = {
  children: React.ReactNode;
};

type LanguageContextType = {
  language: string;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: "nl",
});

const LanguageContextProvider = ({ children }: LanguageContextPropTypes) => {
  return (
    <LanguageContext.Provider value={{ language: "nl" }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContextProvider;
