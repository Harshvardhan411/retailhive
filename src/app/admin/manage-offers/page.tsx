'use client';

import { useState, useEffect } from 'react';
import { getItems, updateItem, deleteItem, Offer, Shop } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface ExtendedOffer extends Offer {
  shopName?: string;
  shopAddress?: string;
}

export default function ManageOffersPage() {
  const [offers, setOffers] = useState<ExtendedOffer[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    shopId: '',
    validUntil: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersData, shopsData] = await Promise.all([
          getItems<Offer>('offers'),
          getItems<Shop>('shops')
        ]);
        
        // Enhance offers with shop information
        const enhancedOffers = offersData.map(offer => {
          const shop = shopsData.find(s => s.id === offer.shopId);
          return {
            ...offer,
            shopName: shop?.shopName || 'Unknown Shop',
            shopAddress: shop?.address || 'Unknown Address'
          };
        });
        
        setOffers(enhancedOffers);
        setShops(shopsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.shopId) return;

    try {
      if (editingId) {
        // Update existing offer
        await updateItem('offers', editingId, formData);
        setOffers(prev => prev.map(offer => 
          offer.id === editingId 
            ? { 
                ...offer, 
                ...formData,
                shopName: shops.find(s => s.id === formData.shopId)?.shopName || 'Unknown Shop'
              }
            : offer
        ));
      }
      
      setFormData({ title: '', description: '', discount: '', shopId: '', validUntil: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  };

  const handleEdit = (offer: ExtendedOffer) => {
    setEditingId(offer.id!);
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      shopId: offer.shopId,
      validUntil: offer.validUntil || ''
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem('offers', id);
      setOffers(prev => prev.filter(offer => offer.id !== id));
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', discount: '', shopId: '', validUntil: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Offers</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          {editingId && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Offer</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount *
                  </label>
                  <input
                    type="text"
                    id="discount"
                    value={formData.discount}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="shopId" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop *
                  </label>
                  <select
                    id="shopId"
                    value={formData.shopId}
                    onChange={(e) => setFormData(prev => ({ ...prev, shopId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a shop</option>
                    {shops.map(shop => (
                      <option key={shop.id} value={shop.id}>
                        {shop.shopName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    id="validUntil"
                    value={formData.validUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Offer
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Offers List */}
          <div className={`bg-white p-6 rounded-lg shadow ${editingId ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              All Offers ({offers.length})
            </h2>
            
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Image 
                            src="/file.svg" 
                            alt="Offer icon" 
                            width={20} 
                            height={20}
                            className="text-blue-600"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{offer.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              {offer.discount}% OFF
                            </span>
                            <span>Shop: {offer.shopName}</span>
                            {offer.validUntil && (
                              <span>Valid until: {new Date(offer.validUntil).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id!)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {offers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No offers found. Create your first offer to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 