'use client';

import { useState, useEffect } from 'react';
import { getItems, Shop, Offer } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface ShopWithOffers extends Shop {
  offers: Offer[];
  categoryName?: string;
  floorName?: string;
}

interface ComparisonItem {
  id: string;
  type: 'shop' | 'offer';
  data: Shop | Offer;
}

export default function ComparePage() {
  const [shops, setShops] = useState<ShopWithOffers[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedItems, setSelectedItems] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsData, offersData, categoriesData, floorsData] = await Promise.all([
          getItems<Shop>('shops'),
          getItems<Offer>('offers'),
          getItems<{ id: string; name: string }>('categories'),
          getItems<{ id: string; name: string }>('floors')
        ]);

        // Enhance shops with offers and category/floor information
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
        setOffers(offersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToComparison = (item: Shop | Offer, type: 'shop' | 'offer') => {
    if (selectedItems.length >= 3) {
      alert('You can compare up to 3 items at a time');
      return;
    }

    const comparisonItem: ComparisonItem = {
      id: item.id!,
      type,
      data: item
    };

    setSelectedItems(prev => [...prev, comparisonItem]);
  };

  const handleRemoveFromComparison = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const renderShopComparison = (shop: ShopWithOffers) => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Image 
            src="/file.svg" 
            alt="Shop icon" 
            width={32} 
            height={32}
            className="text-blue-600"
          />
        </div>
        <h3 className="font-semibold text-gray-900">{shop.shopName}</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Owner:</span> {shop.ownerName}</p>
        <p><span className="font-medium">Address:</span> {shop.address}</p>
        <p><span className="font-medium">Category:</span> {shop.categoryName}</p>
        <p><span className="font-medium">Floor:</span> {shop.floorName}</p>
        {shop.contact && <p><span className="font-medium">Contact:</span> {shop.contact}</p>}
        <p><span className="font-medium">Offers:</span> {shop.offers.length}</p>
      </div>
    </div>
  );

  const renderOfferComparison = (offer: Offer) => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Image 
            src="/file.svg" 
            alt="Offer icon" 
            width={32} 
            height={32}
            className="text-green-600"
          />
        </div>
        <h3 className="font-semibold text-gray-900">{offer.title}</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Description:</span> {offer.description}</p>
        <p><span className="font-medium">Discount:</span> {offer.discount}%</p>
        {offer.validUntil && (
          <p><span className="font-medium">Valid Until:</span> {new Date(offer.validUntil).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Compare Items</h1>
        
        {/* Comparison Area */}
        {selectedItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison ({selectedItems.length}/3)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.type === 'shop' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type === 'shop' ? 'Shop' : 'Offer'}
                    </span>
                    <button
                      onClick={() => handleRemoveFromComparison(item.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {item.type === 'shop' 
                    ? renderShopComparison(item.data as ShopWithOffers)
                    : renderOfferComparison(item.data as Offer)
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selection Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shops */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shops</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {shops.map((shop) => (
                <div key={shop.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Image 
                        src="/file.svg" 
                        alt="Shop icon" 
                        width={20} 
                        height={20}
                        className="text-blue-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{shop.shopName}</h3>
                      <p className="text-sm text-gray-600">{shop.categoryName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToComparison(shop, 'shop')}
                    disabled={selectedItems.some(item => item.id === shop.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      selectedItems.some(item => item.id === shop.id)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {selectedItems.some(item => item.id === shop.id) ? 'Added' : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Offers */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Offers</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {offers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Image 
                        src="/file.svg" 
                        alt="Offer icon" 
                        width={20} 
                        height={20}
                        className="text-green-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{offer.title}</h3>
                      <p className="text-sm text-gray-600">{offer.discount}% OFF</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToComparison(offer, 'offer')}
                    disabled={selectedItems.some(item => item.id === offer.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      selectedItems.some(item => item.id === offer.id)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedItems.some(item => item.id === offer.id) ? 'Added' : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedItems.length === 0 && (
          <div className="text-center py-12">
            <Image 
              src="/file.svg" 
              alt="No comparison" 
              width={64} 
              height={64}
              className="mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Selected</h3>
            <p className="text-gray-600">
              Select up to 3 shops or offers from the lists above to compare them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 