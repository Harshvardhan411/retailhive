"use client";
import React, { useEffect, useState } from 'react';
import { getItems, Shop, Offer } from '../../../utils/firebaseCrud';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Background2 from '@/assets/Background2.png';

interface ShopWithOffers extends Shop {
  offers: Offer[];
  categoryName?: string;
  floorName?: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<ShopWithOffers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
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
        // const userDoc = await getUserById(user.uid); // This line was removed as per the new_code
        // setFavorites(userDoc?.favorites || []); // This line was removed as per the new_code
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    const fetchData = async () => {
      try {
        const [shopsData, offersData, categoriesData, floorsData] = await Promise.all([
          getItems<Shop>('shops'),
          getItems<Offer>('offers'),
          getItems<{ id: string; name: string }>('categories'),
          getItems<{ id: string; name: string }>('floors')
        ]);
        // Enhance shops with offers, category, and floor information
        const enhancedShops = shopsData.map(shop => {
          const shopOffers = offersData.filter(offer => offer.shopId === shop.id);
          const category = categoriesData.find(c => c.id === shop.categoryId);
          const floor = floorsData.find(f => f.id === shop.floorId);
          return {
            ...shop,
            offers: shopOffers,
            categoryName: category?.name || 'Uncategorized',
            floorName: floor?.name || 'Unknown Floor'
          };
        });
        setShops(enhancedShops);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authChecked]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        <div className="text-blue-700 text-xl font-bold animate-pulse">Checking authentication...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredShops = shops.filter((shop: ShopWithOffers) =>
    shop.shopName.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFavorite = async (shopId: string) => {
    if (!userId) return;
    let newFavorites;
    if (favorites.includes(shopId)) {
      newFavorites = favorites.filter(id => id !== shopId);
    } else {
      newFavorites = [...favorites, shopId];
    }
    setFavorites(newFavorites);
    // await updateUserFavorites(userId, newFavorites); // This line was removed as per the new_code
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Image src={Background2} alt="background" fill className="absolute inset-0 w-full h-full object-cover -z-10" />
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-4 sm:p-8 max-w-2xl w-full flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-2">List of Shop Details</h2>
        <input
          type="text"
          placeholder="Search by shop name..."
          className="border rounded px-3 py-2 mb-4 w-full text-gray-900 dark:text-gray-100 dark:bg-gray-900 placeholder-gray-700 dark:placeholder-gray-400 text-sm sm:text-base"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {loading ? <div className="text-center text-gray-900 dark:text-gray-100">Loading...</div> : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border text-gray-900 dark:text-gray-100 text-sm sm:text-base min-w-[500px] dark:bg-gray-900">
              <thead>
                <tr className="bg-blue-100 dark:bg-gray-700">
                  <th className="p-2 border">Shop Name</th>
                  <th className="p-2 border">Owner</th>
                  <th className="p-2 border">Address</th>
                  <th className="p-2 border">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredShops.map((shop: ShopWithOffers) => (
                  <tr key={shop.id} className="border-b">
                    <td className="p-2 border flex items-center gap-2">
                      {shop.shopName}
                      <button
                        aria-label={favorites.includes(shop.id) ? 'Remove from favorites' : 'Add to favorites'}
                        onClick={() => handleToggleFavorite(shop.id)}
                        className="focus:outline-none"
                      >
                        {favorites.includes(shop.id) ? (
                          <span className="text-red-500">&#10084;&#65039;</span>
                        ) : (
                          <span className="text-gray-400">&#9825;</span>
                        )}
                      </button>
                    </td>
                    <td className="p-2 border">{shop.ownerName}</td>
                    <td className="p-2 border">{shop.address}</td>
                    <td className="p-2 border">{shop.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && <div className="text-red-600 dark:text-red-400 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
} 