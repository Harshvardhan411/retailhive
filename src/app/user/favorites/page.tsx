'use client';

import { useState, useEffect } from 'react';
import { getItems, Shop, Offer } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface FavoriteShop extends Shop {
  categoryName?: string;
  floorName?: string;
}

interface FavoriteOffer extends Offer {
  shopName?: string;
}

export default function FavoritesPage() {
  const [favoriteShops, setFavoriteShops] = useState<FavoriteShop[]>([]);
  const [favoriteOffers, setFavoriteOffers] = useState<FavoriteOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'shops' | 'offers'>('shops');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // In a real app, you would fetch user's favorites from their profile
        // For now, we'll simulate by getting all shops and offers
        const [shopsData, offersData, categoriesData, floorsData] = await Promise.all([
          getItems<Shop>('shops'),
          getItems<Offer>('offers'),
          getItems<{ id: string; name: string }>('categories'),
          getItems<{ id: string; name: string }>('floors')
        ]);

        // Enhance shops with category and floor information
        const enhancedShops = shopsData.map(shop => {
          const category = categoriesData.find(c => c.id === shop.categoryId);
          const floor = floorsData.find(f => f.id === shop.floorId);
          return {
            ...shop,
            categoryName: category?.name || 'Uncategorized',
            floorName: floor?.name || 'Unknown Floor'
          };
        });

        // Enhance offers with shop information
        const enhancedOffers = offersData.map(offer => {
          const shop = shopsData.find(s => s.id === offer.shopId);
          return {
            ...offer,
            shopName: shop?.shopName || 'Unknown Shop'
          };
        });

        // For demo purposes, let's consider first 3 shops and offers as favorites
        setFavoriteShops(enhancedShops.slice(0, 3));
        setFavoriteOffers(enhancedOffers.slice(0, 3));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = (id: string, type: 'shop' | 'offer') => {
    if (type === 'shop') {
      setFavoriteShops(prev => prev.filter(shop => shop.id !== id));
    } else {
      setFavoriteOffers(prev => prev.filter(offer => offer.id !== id));
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('shops')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'shops'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Favorite Shops ({favoriteShops.length})
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'offers'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Favorite Offers ({favoriteOffers.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'shops' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteShops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Image 
                          src="/file.svg" 
                          alt="Shop icon" 
                          width={24} 
                          height={24}
                          className="text-blue-600"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{shop.shopName}</h3>
                        <p className="text-sm text-gray-600">{shop.categoryName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromFavorites(shop.id!, 'shop')}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Owner:</span> {shop.ownerName}</p>
                    <p><span className="font-medium">Address:</span> {shop.address}</p>
                    {shop.contact && (
                      <p><span className="font-medium">Contact:</span> {shop.contact}</p>
                    )}
                    {shop.floorName && (
                      <p><span className="font-medium">Floor:</span> {shop.floorName}</p>
                    )}
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <a
                      href={`/user/shop-details?id=${shop.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </a>
                    <a
                      href={`/user/shop-offers?id=${shop.id}`}
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transition-colors"
                    >
                      View Offers
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Image 
                          src="/file.svg" 
                          alt="Offer icon" 
                          width={24} 
                          height={24}
                          className="text-green-600"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                        <p className="text-sm text-gray-600">{offer.shopName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromFavorites(offer.id!, 'offer')}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Description:</span> {offer.description}</p>
                    <p><span className="font-medium">Discount:</span> {offer.discount}% OFF</p>
                    {offer.validUntil && (
                      <p><span className="font-medium">Valid Until:</span> {new Date(offer.validUntil).toLocaleDateString()}</p>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <a
                      href={`/user/shop-offers?id=${offer.shopId}`}
                      className="w-full px-4 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transition-colors"
                    >
                      View Shop Offers
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {((activeTab === 'shops' && favoriteShops.length === 0) || 
          (activeTab === 'offers' && favoriteOffers.length === 0)) && (
          <div className="text-center py-12">
            <Image 
              src="/file.svg" 
              alt="No favorites" 
              width={64} 
              height={64}
              className="mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorite {activeTab === 'shops' ? 'Shops' : 'Offers'}</h3>
            <p className="text-gray-600">
              You haven&apos;t added any {activeTab === 'shops' ? 'shops' : 'offers'} to your favorites yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 