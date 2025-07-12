"use client";

import { useState, useEffect } from 'react';
import { getItems, Shop, Offer } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface Floor {
  id: string;
  name: string;
  description?: string;
}

interface ShopWithFloor extends Shop {
  floorName?: string;
  categoryName?: string;
  offers: Offer[];
}

export default function FloorsPage() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [shops, setShops] = useState<ShopWithFloor[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [floorsData, shopsData, offersData, categoriesData] = await Promise.all([
          getItems<Floor>('floors'),
          getItems<Shop>('shops'),
          getItems<Offer>('offers'),
          getItems<{ id: string; name: string }>('categories')
        ]);
        
        // Enhance shops with floor, category, and offers information
        const enhancedShops = shopsData.map(shop => {
          const shopOffers = offersData.filter(offer => offer.shopId === shop.id);
          const floor = floorsData.find(f => f.id === shop.floorId);
          const category = categoriesData.find(c => c.id === shop.categoryId);
          
          return {
            ...shop,
            offers: shopOffers,
            floorName: floor?.name || 'Unknown Floor',
            categoryName: category?.name || 'Uncategorized'
          };
        });
        
        setFloors(floorsData);
        setShops(enhancedShops);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredShops = selectedFloor 
    ? shops.filter(shop => shop.floorId === selectedFloor)
    : shops;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Floors</h1>
        
        {/* Floor Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFloor(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFloor === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Floors
            </button>
            {floors.map(floor => (
              <button
                key={floor.id}
                onClick={() => setSelectedFloor(floor.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFloor === floor.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {floor.name}
              </button>
            ))}
          </div>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
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
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Owner:</span> {shop.ownerName}</p>
                  <p><span className="font-medium">Address:</span> {shop.address}</p>
                  <p><span className="font-medium">Floor:</span> {shop.floorName}</p>
                  {shop.contact && (
                    <p><span className="font-medium">Contact:</span> {shop.contact}</p>
                  )}
                  <p><span className="font-medium">Offers:</span> {shop.offers.length}</p>
                  {shop.offers.length > 0 && (
                    <p><span className="font-medium">Max Discount:</span> {Math.max(...shop.offers.map(offer => parseInt(offer.discount) || 0))}%</p>
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

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <Image 
              src="/file.svg" 
              alt="No shops" 
              width={64} 
              height={64}
              className="mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Shops Found</h3>
            <p className="text-gray-600">
              {selectedFloor 
                ? 'No shops found on this floor.'
                : 'No shops available at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 