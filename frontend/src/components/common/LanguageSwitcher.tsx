import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'expanded';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-lg p-0.5 bg-slate-800/80 border border-slate-700 text-xs font-semibold select-none ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 min-h-[32px] sm:min-h-[28px] ${
          lang === 'en'
            ? 'bg-white text-slate-900 shadow-xs font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-pressed={lang === 'en'}
      >
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLang('bn')}
        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 min-h-[32px] sm:min-h-[28px] ${
          lang === 'bn'
            ? 'bg-white text-slate-900 shadow-xs font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-pressed={lang === 'bn'}
      >
        <span className="font-bengali">বাংলা</span>
      </button>
    </div>
  );
};
