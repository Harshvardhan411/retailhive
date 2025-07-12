"use client";
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { getUserById, updateItem } from '../../../utils/firebaseCrud';
import Background2 from '@/assets/Background2.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UserProfile() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', address: '', mobile: '' });
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [notifications, setNotifications] = useState({ offers: true, shopUpdates: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/user/login');
        return;
      }
      
      setUserId(user.uid);
      try {
        const userDoc = await getUserById(user.uid);
        setUser(userDoc);
        if (userDoc) {
          setForm({
            name: userDoc.name || '',
            email: userDoc.email || '',
            address: userDoc.address || '',
            mobile: userDoc.mobile || '',
          });
        }
      } catch (err: any) {
        setError('Failed to load user profile: ' + err.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!userId) return;
    try {
      await updateItem('users', userId, form);
      setSuccess('Profile updated successfully!');
      // Update the user state with new data
      setUser({ ...user, ...form });
    } catch (err: any) {
      setError('Failed to update profile: ' + err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pw !== pw2) { setPwError('Passwords do not match.'); return; }
    if (pw.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    if (!auth.currentUser) { setPwError('Not authenticated.'); return; }
    try {
      await updatePassword(auth.currentUser, pw);
      setPwSuccess('Password updated successfully!');
      setPw(''); setPw2('');
    } catch (err: any) {
      setPwError('Failed to update password: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img src={Background2.src} alt="background" className="absolute inset-0 w-full h-full object-cover -z-10" />
      
      {/* Back Button */}
      <div className="absolute top-6 left-8 z-20">
        <Link 
          href="/user" 
          className="bg-blue-600 text-white font-bold px-5 py-2 rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
        >
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-4 sm:p-10 max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-2">Profile</h2>
        {loading ? <div className="text-center text-gray-900 dark:text-gray-100">Loading...</div> : (
          <>
            <form className="flex flex-col gap-4 w-full" onSubmit={handleSave}>
              <input 
                name="name" 
                type="text" 
                placeholder="Name" 
                className="border rounded px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-900 placeholder-gray-700 dark:placeholder-gray-400" 
                value={form.name} 
                onChange={handleChange} 
                required 
              />
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                className="border rounded px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-900 placeholder-gray-700 dark:placeholder-gray-400" 
                value={form.email} 
                onChange={handleChange} 
                required 
              />
              <input 
                name="address" 
                type="text" 
                placeholder="Address" 
                className="border rounded px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-900 placeholder-gray-700 dark:placeholder-gray-400" 
                value={form.address} 
                onChange={handleChange} 
                required 
              />
              <input 
                name="mobile" 
                type="text" 
                placeholder="Mobile" 
                className="border rounded px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-900 placeholder-gray-700 dark:placeholder-gray-400" 
                value={form.mobile} 
                onChange={handleChange} 
                required 
              />
              <button 
                type="submit" 
                className="bg-blue-600 dark:bg-blue-800 text-white py-2 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
              >
                Save Profile
              </button>
              {success && <div className="text-green-700 dark:text-green-300 text-center font-semibold">{success}</div>}
              {error && <div className="text-red-600 dark:text-red-400 text-center font-semibold">{error}</div>}
            </form>
            <div className="w-full mt-8">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Change Password</h3>
              <form className="flex flex-col gap-2" onSubmit={handleChangePassword}>
                <input 
                  type="password" 
                  placeholder="New Password" 
                  className="border rounded px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-900 placeholder-gray-700 dark:placeholder-gray-400" 
                  value={pw} 
                  onChange={e => setPw(e.target.value)} 
                  required 
                />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="border rounded px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-900 placeholder-gray-700 dark:placeholder-gray-400" 
                  value={pw2} 
                  onChange={e => setPw2(e.target.value)} 
                  required 
                />
                <button 
                  type="submit" 
                  className="bg-green-600 dark:bg-green-800 text-white py-2 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50"
                >
                  Change Password
                </button>
                {pwSuccess && <div className="text-green-700 dark:text-green-300 text-center font-semibold">{pwSuccess}</div>}
                {pwError && <div className="text-red-600 dark:text-red-400 text-center font-semibold">{pwError}</div>}
              </form>
            </div>
            <div className="w-full mt-8">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Notification Preferences</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={notifications.offers} 
                    onChange={e => setNotifications(n => ({ ...n, offers: e.target.checked }))} 
                    className="rounded"
                  />
                  <span className="text-gray-900 dark:text-gray-100">Receive offer notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={notifications.shopUpdates} 
                    onChange={e => setNotifications(n => ({ ...n, shopUpdates: e.target.checked }))} 
                    className="rounded"
                  />
                  <span className="text-gray-900 dark:text-gray-100">Receive shop update notifications</span>
                </label>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">(Preferences not yet functional)</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 