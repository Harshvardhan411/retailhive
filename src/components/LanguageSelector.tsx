"use client";
import React, { useState } from 'react';
import { Language, getLanguageName, getTranslation } from '../utils/translations';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

export default function LanguageSelector({ currentLanguage, onLanguageChange, className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = ['en', 'es', 'fr', 'hi', 'zh'];

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800"
        aria-label={getTranslation('common.language', currentLanguage)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">🌐</span>
        <span>{getLanguageName(currentLanguage)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <ul
            role="listbox"
            className="py-1"
            aria-label={getTranslation('common.language', currentLanguage)}
          >
            {languages.map((language) => (
              <li key={language} role="option" aria-selected={language === currentLanguage}>
                <button
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 ${
                    language === currentLanguage
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {language === 'en' && '🇺🇸'}
                      {language === 'es' && '🇪🇸'}
                      {language === 'fr' && '🇫🇷'}
                      {language === 'hi' && '🇮🇳'}
                      {language === 'zh' && '🇨🇳'}
                    </span>
                    <span>{getLanguageName(language)}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 