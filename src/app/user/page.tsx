"use client";
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Background2 from '@/assets/Background2.png';
import LanguageSelector from '../../components/LanguageSelector';
import { Language, getTranslation } from '../../utils/translations';
import { useState, useRef } from 'react';
import React from 'react'; // Added missing import for React.useEffect

export default function UserHome() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/');
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Image src={Background2} alt="background" fill className="absolute inset-0 w-full h-full object-cover -z-10" />
      
      {/* Profile Dropdown in Top Right */}
      <div className="absolute top-6 right-8 flex items-center z-20" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="bg-blue-900 text-white font-bold px-5 py-2 rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 flex items-center gap-2"
            aria-label="Profile menu"
          >
            <span className="material-icons align-middle">account_circle</span>
            Profile
            <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-30">
              <Link
                href="/user/profile"
                className="block px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-t-xl"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => { setDropdownOpen(false); handleLogout(); }}
                className="block w-full text-left px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-4xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700 dark:text-green-300 mb-6 text-center">
          {getTranslation('user.welcome', currentLanguage)}
        </h1>
        
        {/* Optionally, add a custom welcome or instruction message here. Removed the 'Loading...' text. */}
        
        <div className="flex flex-col gap-4 w-full">
          <Link 
            href="/user/categories" 
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label={getTranslation('user.categories', currentLanguage)}
            role="button"
            tabIndex={0}
          >
            {getTranslation('user.categories', currentLanguage)}
          </Link>
          <Link 
            href="/user/shops" 
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label={getTranslation('user.shops', currentLanguage)}
            role="button"
            tabIndex={0}
          >
            {getTranslation('user.shops', currentLanguage)}
          </Link>
          <Link 
            href="/user/offers" 
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label={getTranslation('user.offers', currentLanguage)}
            role="button"
            tabIndex={0}
          >
            {getTranslation('user.offers', currentLanguage)}
          </Link>
          <Link 
            href="/user/compare" 
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label={getTranslation('user.compare', currentLanguage)}
            role="button"
            tabIndex={0}
          >
            {getTranslation('user.compare', currentLanguage)}
          </Link>
          <Link 
            href="/user/recommendations" 
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label={getTranslation('user.recommendations', currentLanguage)}
            role="button"
            tabIndex={0}
          >
            {getTranslation('user.recommendations', currentLanguage)}
          </Link>
          {/* Profile button removed from here */}
          <Link 
            href="/user/filter" 
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label={getTranslation('user.filter', currentLanguage)}
            role="button"
            tabIndex={0}
          >
            {getTranslation('user.filter', currentLanguage)}
          </Link>
          <Link 
            href="/user/shop-offers" 
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label={getTranslation('user.shopOffers', currentLanguage)}
            role="button"
            tabIndex={0}
          >
            {getTranslation('user.shopOffers', currentLanguage)}
          </Link>
          <Link 
            href="/user/floors" 
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label={getTranslation('user.floors', currentLanguage)}
            role="button"
            tabIndex={0}
          >
            {getTranslation('user.floors', currentLanguage)}
          </Link>
          <Link 
            href="/user/shop-details" 
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label={getTranslation('user.shopDetails', currentLanguage)}
            role="button"
            tabIndex={0}
          >
            {getTranslation('user.shopDetails', currentLanguage)}
          </Link>
        </div>
      </div>
    </div>
  );
} 