"use client";
import React, { useEffect, useState } from 'react';
import { getPersonalizedRecommendations, getTrendingOffers, getUserById, updateUserFavorites } from '../../../utils/firebaseCrud';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { useRouter } from 'next/navigation';
import Background2 from '@/assets/Background2.png';
import Image from 'next/image';

interface Recommendation {
  id: string;
  type: 'shop' | 'offer';
  data: Shop | Offer;
}

export default function UserRecommendations() {
  const [personalizedOffers, setPersonalizedOffers] = useState<any[]>([]);
  const [trendingOffers, setTrendingOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/user/login');
      } else {
        setAuthChecked(true);
        setUserId(user.uid);
        // Fetch user favorites
        const userDoc = await getUserById(user.uid);
        setFavorites(userDoc?.favorites || []);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authChecked || !userId) return;
    
    const fetchRecommendations = async () => {
      setLoading(true);
      setError('');
      try {
        const [personalized, trending] = await Promise.all([
          getPersonalizedRecommendations(userId, 6),
          getTrendingOffers(6)
        ]);
        setPersonalizedOffers(personalized);
        setTrendingOffers(trending);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [authChecked, userId]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        <div className="text-blue-700 text-xl font-bold animate-pulse">Checking authentication...</div>
      </div>
    );
  }

  const handleToggleFavorite = async (offerId: string) => {
    if (!userId) return;
    let newFavorites;
    if (favorites.includes(offerId)) {
      newFavorites = favorites.filter(id => id !== offerId);
    } else {
      newFavorites = [...favorites, offerId];
    }
    setFavorites(newFavorites);
    await updateUserFavorites(userId, newFavorites);
  };

  const OfferCard = ({ offer, type }: { offer: any; type: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{offer.title}</h3>
        <button
          onClick={() => handleToggleFavorite(offer.id)}
          className={`text-2xl ${favorites.includes(offer.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
        >
          {favorites.includes(offer.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{offer.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-green-600 dark:text-green-400 font-bold">{offer.discount}% OFF</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {type === 'personalized' ? `Score: ${offer.recommendationScore?.toFixed(1)}` : `Trending: ${offer.trendingScore}`}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img src={Background2.src} alt="background" className="absolute inset-0 w-full h-full object-cover -z-10" />
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-6xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700 dark:text-green-300 mb-6 text-center">
          Personalized Recommendations
        </h1>
        
        {loading ? (
          <div className="text-center text-gray-900 dark:text-gray-100 text-xl">Loading recommendations...</div>
        ) : (
          <div className="space-y-8">
            {/* Personalized Recommendations */}
            <section>
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4">
                Recommended for You
              </h2>
              {personalizedOffers.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  Start favoriting offers and rating them to get personalized recommendations!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personalizedOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} type="personalized" />
                  ))}
                </div>
              )}
            </section>

            {/* Trending Offers */}
            <section>
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4">
                Trending Now
              </h2>
              {trendingOffers.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No trending offers at the moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} type="trending" />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 dark:text-red-400 mt-4 text-center">{error}</div>
        )}
      </div>
    </div>
  );
} 