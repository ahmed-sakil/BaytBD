import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { bn } from '../locales/bn';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  formatNumber: (num: number | string) => string;
  formatCurrency: (amount: number) => string;
  isBangla: boolean;
}

const dictionaries = { en, bn };

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (path: string) => path,
  formatNumber: (num: number | string) => String(num),
  formatCurrency: (amount: number) => `৳${amount.toLocaleString()}`,
  isBangla: false,
});

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('baytbd_lang');
    if (saved === 'bn' || saved === 'en') return saved;
    return 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('baytbd_lang', newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === 'bn') {
      document.body.classList.add('font-bengali');
    } else {
      document.body.classList.remove('font-bengali');
    }
  }, [lang]);

  // Robust nested key resolver
  const resolveNested = (dict: any, keys: string[]): string | undefined => {
    let current = dict;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    return typeof current === 'string' ? current : undefined;
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    // 1. Try active language
    const activeVal = resolveNested(dictionaries[lang], keys);
    if (activeVal !== undefined && activeVal !== '') return activeVal;

    // 2. Fallback to English
    const enVal = resolveNested(dictionaries.en, keys);
    if (enVal !== undefined && enVal !== '') return enVal;

    // 3. Fallback to Bangla
    const bnVal = resolveNested(dictionaries.bn, keys);
    if (bnVal !== undefined && bnVal !== '') return bnVal;

    return fallback || path;
  };

  // Convert English numbers to Bengali numerals if in Bengali mode
  const formatNumber = (num: number | string): string => {
    const str = String(num);
    if (lang !== 'bn') return str;
    return str.replace(/[0-9]/g, (char) => BENGALI_DIGITS[char] || char);
  };

  // Format currency: ৳ 1,200 or ৳ ১,২০০
  const formatCurrency = (amount: number): string => {
    const formatted = amount.toLocaleString();
    if (lang === 'bn') {
      return `৳ ${formatNumber(formatted)}`;
    }
    return `৳ ${formatted}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        formatNumber,
        formatCurrency,
        isBangla: lang === 'bn',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
