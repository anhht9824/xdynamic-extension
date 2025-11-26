export type Language = 'en' | 'vi';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface Translations {
  [key: string]: {
    en: string;
    vi: string;
  };
}