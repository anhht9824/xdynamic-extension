import React, { createContext, useContext, ReactNode } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { Language } from "../types";

interface LanguageContextType {
  language: Language;
  changeLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isEnglish: boolean;
  isVietnamese: boolean;
  availableLanguages: readonly { code: Language; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const languageHook = useLanguage();

  return (
    <LanguageContext.Provider value={languageHook}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  }
  return context;
};
