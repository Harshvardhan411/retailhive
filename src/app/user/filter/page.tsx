'use client';

import { useState, useEffect } from 'react';
import { getItems, Shop, Offer } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface Floor {
  id: string;
  name: string;
}

interface ShopWithDetails extends Shop {
  categoryName?: string;
  floorName?: string;
  offers: Offer[];
}

interface FilterState {
  category: string;
  floor: string;
  minDiscount: string;
  maxDiscount: string;
  searchTerm: string;
}

export default function FilterPage() {
  const [shops, setShops] = useState<ShopWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [filteredShops, setFilteredShops] = useState<ShopWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    floor: '',
    minDiscount: '',
    maxDiscount: '',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsData, offersData, categoriesData, floorsData] = await Promise.all([
          getItems<Shop>('shops'),
          getItems<Offer>('offers'),
          getItems<Category>('categories'),
          getItems<Floor>('floors')
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
        setFilteredShops(enhancedShops);
        setCategories(categoriesData);
        setFloors(floorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...shops];

      // Search filter
      if (filters.searchTerm) {
        filtered = filtered.filter(shop =>
          shop.shopName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          shop.ownerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          shop.address.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }

      // Category filter
      if (filters.category) {
        filtered = filtered.filter(shop => shop.categoryId === filters.category);
      }

      // Floor filter
      if (filters.floor) {
        filtered = filtered.filter(shop => shop.floorId === filters.floor);
      }

      // Discount range filter
      if (filters.minDiscount || filters.maxDiscount) {
        filtered = filtered.filter(shop => {
          const maxDiscount = Math.max(...shop.offers.map(offer => parseInt(offer.discount) || 0));
          const minDiscount = Math.min(...shop.offers.map(offer => parseInt(offer.discount) || 0));
          
          if (filters.minDiscount && maxDiscount < parseInt(filters.minDiscount)) return false;
          if (filters.maxDiscount && minDiscount > parseInt(filters.maxDiscount)) return false;
          return true;
        });
      }

      setFilteredShops(filtered);
    };

    applyFilters();
  }, [filters, shops]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      floor: '',
      minDiscount: '',
      maxDiscount: '',
      searchTerm: ''
    });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Filter Shops</h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Search shops, owners, or addresses..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor
              </label>
              <select
                value={filters.floor}
                onChange={(e) => handleFilterChange('floor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Floors</option>
                {floors.map(floor => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Discount (%)
              </label>
              <input
                type="number"
                value={filters.minDiscount}
                onChange={(e) => handleFilterChange('minDiscount', e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Discount (%)
              </label>
              <input
                type="number"
                value={filters.maxDiscount}
                onChange={(e) => handleFilterChange('maxDiscount', e.target.value)}
                placeholder="100"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Results ({filteredShops.length} shops)
          </h2>
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
                  {shop.floorName && (
                    <p><span className="font-medium">Floor:</span> {shop.floorName}</p>
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
              alt="No results" 
              width={64} 
              height={64}
              className="mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Shops Found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to find more shops.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 