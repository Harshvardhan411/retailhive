"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FaSignInAlt } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import LanguageSelector from '../../components/LanguageSelector';
import { Language } from '../../utils/translations';
import Image from 'next/image';

export default function AdminHome() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const db = getFirestore();

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check admin approval status
        const adminRef = doc(db, 'adminSignups', user.uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists() && adminSnap.data().status === 'approved') {
          setIsLoggedIn(true);
          setIsAuthorized(true);
        } else {
          setIsLoggedIn(true);
          setIsAuthorized(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsAuthorized(false);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [db]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
        <div className="text-green-700 text-xl font-bold animate-pulse">Checking authentication...</div>
      </div>
    );
  }
  if (isLoggedIn && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
        <div className="text-red-700 text-xl font-bold">You are not authorized to access the admin portal. Please wait for approval.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Image src="/Background1.png" alt="background" fill className="absolute inset-0 w-full h-full object-cover -z-10" />
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
                href="/admin/profile"
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
      <div className="bg-white/90 rounded-3xl shadow-2xl p-12 max-w-xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-green-700 mb-2 drop-shadow-lg">RetailHive Admin Portal</h1>
        <p className="text-gray-900 mb-8 text-center max-w-md">
          Manage shops, offers, categories, and more in RetailHive. Only authorized admins can access these features.
        </p>
        <div className="flex flex-col gap-4 w-full">
          {!isLoggedIn && (
            <Link href="/admin/login" className="flex items-center gap-3 bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform justify-center">
              <FaSignInAlt className="text-xl text-white" /> Login
            </Link>
          )}
          {isLoggedIn && isAuthorized && (
            <>
              <Link href="/admin/create-shop" className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center">Create Shop</Link>
              <Link href="/admin/manage-shops" className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center">Manage Shops</Link>
              <Link href="/admin/manage-category-floor" className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center">Manage Category & Floor</Link>
              <Link href="/admin/manage-offers" className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center">Manage Offers</Link>
              <Link href="/admin/analytics" className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center">Analytics Dashboard</Link>
              <Link href="/admin/bulk-upload" className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center">Bulk Upload</Link>
              <Link href="/admin/expired-offers" className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center">Expired Offers</Link>
              <Link href="/admin/qr-codes" className="bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform text-center">QR Code Generator</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 