"use client";

import { useState, useEffect } from 'react';
import { getExpiredOffers, extendOfferValidity, Offer } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface ExtendedOffer extends Offer {
  shopName?: string;
  shopAddress?: string;
}

export default function ExpiredOffersPage() {
  const [expiredOffers, setExpiredOffers] = useState<ExtendedOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [extendingId, setExtendingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpiredOffers = async () => {
      try {
        const offers = await getExpiredOffers();
        setExpiredOffers(offers);
      } catch (error) {
        console.error('Error fetching expired offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiredOffers();
  }, []);

  const handleExtendValidity = async (offerId: string) => {
    setExtendingId(offerId);
    try {
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + 30); // Extend by 30 days
      
      await extendOfferValidity(offerId, newExpiryDate.toISOString().split('T')[0]);
      
      // Remove from expired offers list
      setExpiredOffers(prev => prev.filter(offer => offer.id !== offerId));
    } catch (error) {
      console.error('Error extending offer validity:', error);
    } finally {
      setExtendingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Expired Offers</h1>
        
        {expiredOffers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <Image 
              src="/file.svg" 
              alt="No expired offers" 
              width={64} 
              height={64}
              className="mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Expired Offers</h3>
            <p className="text-gray-600">All offers are currently active.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {expiredOffers.map((offer) => (
              <div key={offer.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Image 
                          src="/file.svg" 
                          alt="Expired offer" 
                          width={24} 
                          height={24}
                          className="text-red-600"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{offer.title}</h3>
                        <p className="text-gray-600 mt-1">{offer.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Discount: {offer.discount}%</span>
                          <span>Expired: {offer.validUntil ? formatDate(offer.validUntil) : 'Unknown'}</span>
                          {offer.shopName && (
                            <span>Shop: {offer.shopName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <button
                      onClick={() => handleExtendValidity(offer.id!)}
                      disabled={extendingId === offer.id}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        extendingId === offer.id
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {extendingId === offer.id ? 'Extending...' : 'Extend 30 Days'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 