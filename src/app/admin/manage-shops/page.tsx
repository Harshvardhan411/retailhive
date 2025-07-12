'use client';

import { useState, useEffect } from 'react';
import { getItems, updateItem, deleteItem, Shop } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface ExtendedShop extends Shop {
  categoryName?: string;
  floorName?: string;
}

export default function ManageShopsPage() {
  const [shops, setShops] = useState<ExtendedShop[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [floors, setFloors] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    address: '',
    contact: '',
    categoryId: '',
    floorId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsData, categoriesData, floorsData] = await Promise.all([
          getItems<Shop>('shops'),
          getItems<{ id: string; name: string }>('categories'),
          getItems<{ id: string; name: string }>('floors')
        ]);
        
        // Enhance shops with category and floor information
        const enhancedShops = shopsData.map(shop => {
          const category = categoriesData.find(c => c.id === shop.categoryId);
          const floor = floorsData.find(f => f.id === shop.floorId);
          return {
            ...shop,
            categoryName: category?.name || 'Unknown Category',
            floorName: floor?.name || 'Unknown Floor'
          };
        });
        
        setShops(enhancedShops);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopName.trim() || !formData.ownerName.trim()) return;

    try {
      if (editingId) {
        // Update existing shop
        await updateItem('shops', editingId, formData);
        setShops(prev => prev.map(shop => 
          shop.id === editingId 
            ? { 
                ...shop, 
                ...formData,
                categoryName: categories.find(c => c.id === formData.categoryId)?.name || 'Unknown Category',
                floorName: floors.find(f => f.id === formData.floorId)?.name || 'Unknown Floor'
              }
            : shop
        ));
      }
      
      setFormData({ shopName: '', ownerName: '', address: '', contact: '', categoryId: '', floorId: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating shop:', error);
    }
  };

  const handleEdit = (shop: ExtendedShop) => {
    setEditingId(shop.id!);
    setFormData({
      shopName: shop.shopName,
      ownerName: shop.ownerName,
      address: shop.address,
      contact: shop.contact || '',
      categoryId: shop.categoryId || '',
      floorId: shop.floorId || ''
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem('shops', id);
      setShops(prev => prev.filter(shop => shop.id !== id));
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ shopName: '', ownerName: '', address: '', contact: '', categoryId: '', floorId: '' });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Shops</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          {editingId && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Shop</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    value={formData.shopName}
                    onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="floorId" className="block text-sm font-medium text-gray-700 mb-1">
                    Floor
                  </label>
                  <select
                    id="floorId"
                    value={formData.floorId}
                    onChange={(e) => setFormData(prev => ({ ...prev, floorId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a floor</option>
                    {floors.map(floor => (
                      <option key={floor.id} value={floor.id}>
                        {floor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Shop
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

          {/* Shops List */}
          <div className={`bg-white p-6 rounded-lg shadow ${editingId ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              All Shops ({shops.length})
            </h2>
            
            <div className="space-y-4">
              {shops.map((shop) => (
                <div key={shop.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Image 
                            src="/file.svg" 
                            alt="Shop icon" 
                            width={20} 
                            height={20}
                            className="text-green-600"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{shop.shopName}</h3>
                          <p className="text-sm text-gray-600 mt-1">Owner: {shop.ownerName}</p>
                          <p className="text-sm text-gray-600">{shop.address}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            {shop.contact && <span>📞 {shop.contact}</span>}
                            {shop.categoryName && <span>🏷️ {shop.categoryName}</span>}
                            {shop.floorName && <span>🏢 {shop.floorName}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(shop)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(shop.id!)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {shops.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No shops found. Create your first shop to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 