'use client';

import { useState, useEffect } from 'react';
import { getItems, Shop, Offer } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface OfferWithShop extends Offer {
  shopName?: string;
  shopAddress?: string;
  categoryName?: string;
  floorName?: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferWithShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'discount' | 'title' | 'shop'>('discount');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersData, shopsData, categoriesData, floorsData] = await Promise.all([
          getItems<Offer>('offers'),
          getItems<Shop>('shops'),
          getItems<{ id: string; name: string }>('categories'),
          getItems<{ id: string; name: string }>('floors')
        ]);

        // Enhance offers with shop, category, and floor information
        const enhancedOffers = offersData.map(offer => {
          const shop = shopsData.find(s => s.id === offer.shopId);
          const category = categoriesData.find(c => c.id === shop?.categoryId);
          const floor = floorsData.find(f => f.id === shop?.floorId);
          
          return {
            ...offer,
            shopName: shop?.shopName || 'Unknown Shop',
            shopAddress: shop?.address || 'Unknown Address',
            categoryName: category?.name || 'Uncategorized',
            floorName: floor?.name || 'Unknown Floor'
          };
        });

        setOffers(enhancedOffers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAndSortedOffers = offers
    .filter(offer =>
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return parseInt(b.discount) - parseInt(a.discount);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'shop':
          return (a.shopName || '').localeCompare(b.shopName || '');
        default:
          return 0;
      }
    });

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Offers</h1>
        
        {/* Search and Sort Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Offers
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description, or shop name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'discount' | 'title' | 'shop')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="discount">Highest Discount</option>
                <option value="title">Title A-Z</option>
                <option value="shop">Shop Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredAndSortedOffers.length} of {offers.length} offers
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedOffers.map((offer) => (
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
                  <div className="text-right">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {offer.discount}% OFF
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Description:</span> {offer.description}</p>
                  <p><span className="font-medium">Shop:</span> {offer.shopName}</p>
                  <p><span className="font-medium">Address:</span> {offer.shopAddress}</p>
                  {offer.categoryName && (
                    <p><span className="font-medium">Category:</span> {offer.categoryName}</p>
                  )}
                  {offer.floorName && (
                    <p><span className="font-medium">Floor:</span> {offer.floorName}</p>
                  )}
                  {offer.validUntil && (
                    <p><span className="font-medium">Valid Until:</span> {new Date(offer.validUntil).toLocaleDateString()}</p>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <a
                    href={`/user/shop-details?id=${offer.shopId}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Shop
                  </a>
                  <a
                    href={`/user/shop-offers?id=${offer.shopId}`}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transition-colors"
                  >
                    All Offers
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedOffers.length === 0 && (
          <div className="text-center py-12">
            <Image 
              src="/file.svg" 
              alt="No offers" 
              width={64} 
              height={64}
              className="mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Offers Found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms to find more offers.'
                : 'No offers available at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 