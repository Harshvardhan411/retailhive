"use client";
import React, { useEffect, useState } from 'react';
import { getItems, Shop, Offer, Review } from '../../../utils/firebaseCrud';
import { getReviews, addReview, updateReview, deleteReview } from '../../../utils/firebaseCrud';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import Image from 'next/image';
import Background2 from '@/assets/Background2.png';

interface ShopWithDetails extends Shop {
  offers: Offer[];
  reviews: Review[];
}

export default function ShopDetailsPage() {
  const [shop, setShop] = useState<ShopWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching shop details, offers, and reviews
        const [shopsData, offersData, reviewsData] = await Promise.all([
          getItems<Shop>('shops'),
          getItems<Offer>('offers'),
          getItems<Review>('reviews')
        ]);
        const shopData = shopsData[0]; // Simulate current shop
        const shopOffers = offersData.filter(offer => offer.shopId === shopData.id);
        const shopReviews = reviewsData.filter(review => review.shopId === shopData.id);
        setShop({ ...shopData, offers: shopOffers, reviews: shopReviews });
      } catch (error) {
        console.error('Error fetching shop details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !shop) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{shop.shopName}</h1>
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <Image src="/file.svg" alt="Shop avatar" width={48} height={48} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{shop.shopName}</h2>
              <p className="text-gray-600">{shop.address}</p>
              <p className="text-gray-600">Owner: {shop.ownerName}</p>
              <p className="text-gray-600">Contact: {shop.contact}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Offers</h3>
            <ul className="space-y-2">
              {shop.offers.map(offer => (
                <li key={offer.id} className="flex items-center space-x-3">
                  <Image src="/file.svg" alt="Offer icon" width={20} height={20} className="text-green-600" />
                  <span>{offer.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
            <ul className="space-y-2">
              {shop.reviews.map(review => (
                <li key={review.id} className="flex items-center space-x-3">
                  <Image src="/file.svg" alt="Review icon" width={20} height={20} className="text-yellow-600" />
                  <span>{review.comment}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 