"use client";

import { useState, useEffect } from 'react';
import { getItems, Shop } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ShopWithCategory extends Shop {
  categoryName?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<ShopWithCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, shopsData] = await Promise.all([
          getItems<Category>('categories'),
          getItems<Shop>('shops')
        ]);
        
        // Enhance shops with category information
        const enhancedShops = shopsData.map(shop => ({
          ...shop,
          categoryName: categoriesData.find(c => c.id === shop.categoryId)?.name || 'Uncategorized'
        }));
        
        setCategories(categoriesData);
        setShops(enhancedShops);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredShops = selectedCategory 
    ? shops.filter(shop => shop.categoryId === selectedCategory)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>
        
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.name}
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
                  {shop.contact && (
                    <p><span className="font-medium">Contact:</span> {shop.contact}</p>
                  )}
                  {shop.floor && (
                    <p><span className="font-medium">Floor:</span> {shop.floor}</p>
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
              {selectedCategory 
                ? 'No shops found in this category.'
                : 'No shops available at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 