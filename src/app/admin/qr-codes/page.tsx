"use client";

import { useState, useEffect } from 'react';
import { getItems, Shop, Offer } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface QRCodeData {
  id: string;
  type: 'shop' | 'offer';
  title: string;
  description: string;
  qrCodeUrl: string;
  downloadUrl: string;
}

export default function QRCodesPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'shop' | 'offer'>('shop');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsData, offersData] = await Promise.all([
          getItems<Shop>('shops'),
          getItems<Offer>('offers')
        ]);
        
        setShops(shopsData);
        setOffers(offersData);
        
        // Generate QR codes for shops
        const shopQRCodes: QRCodeData[] = shopsData.map(shop => ({
          id: shop.id!,
          type: 'shop',
          title: shop.shopName,
          description: shop.address,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`/user/shop-details?id=${shop.id}`)}`,
          downloadUrl: `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`/user/shop-details?id=${shop.id}`)}`
        }));
        
        // Generate QR codes for offers
        const offerQRCodes: QRCodeData[] = offersData.map(offer => ({
          id: offer.id!,
          type: 'offer',
          title: offer.title,
          description: offer.description,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`/user/shop-offers?id=${offer.shopId}`)}`,
          downloadUrl: `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`/user/shop-offers?id=${offer.shopId}`)}`
        }));
        
        setQrCodes([...shopQRCodes, ...offerQRCodes]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = (qrCode: QRCodeData) => {
    const link = document.createElement('a');
    link.href = qrCode.downloadUrl;
    link.download = `${qrCode.type}-${qrCode.id}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    const filteredQRCodes = qrCodes.filter(qr => qr.type === selectedType);
    filteredQRCodes.forEach(qrCode => {
      setTimeout(() => handleDownload(qrCode), 100);
    });
  };

  const filteredQRCodes = qrCodes.filter(qr => qr.type === selectedType);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QR Codes</h1>
        
        {/* Type Selector */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          <button
            onClick={() => setSelectedType('shop')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              selectedType === 'shop'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Shops ({shops.length})
          </button>
          <button
            onClick={() => setSelectedType('offer')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              selectedType === 'offer'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Offers ({offers.length})
          </button>
        </div>

        {/* Download All Button */}
        {filteredQRCodes.length > 0 && (
          <div className="mb-6">
            <button
              onClick={handleDownloadAll}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Image 
                src="/file.svg" 
                alt="Download" 
                width={20} 
                height={20}
                className="mr-2"
              />
              Download All {selectedType} QR Codes
            </button>
          </div>
        )}

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQRCodes.map((qrCode) => (
            <div key={qrCode.id} className="bg-white p-6 rounded-lg shadow">
              <div className="text-center">
                <div className="mb-4">
                  <Image 
                    src={qrCode.qrCodeUrl} 
                    alt={`QR Code for ${qrCode.title}`}
                    width={200} 
                    height={200}
                    className="mx-auto border border-gray-200 rounded-lg"
                  />
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">{qrCode.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{qrCode.description}</p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(qrCode)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => window.open(qrCode.qrCodeUrl, '_blank')}
                    className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQRCodes.length === 0 && (
          <div className="text-center py-12">
            <Image 
              src="/file.svg" 
              alt="No QR codes" 
              width={64} 
              height={64}
              className="mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No QR Codes Available</h3>
            <p className="text-gray-600">
              No {selectedType}s found. Create some {selectedType}s first to generate QR codes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 