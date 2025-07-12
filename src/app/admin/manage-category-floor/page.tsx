'use client';

import { useState, useEffect } from 'react';
import { getItems, addItem, updateItem, deleteItem } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Floor {
  id: string;
  name: string;
  description?: string;
}

interface FormData {
  name: string;
  description: string;
}

export default function ManageCategoryFloorPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'floors'>('categories');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, floorsData] = await Promise.all([
          getItems<Category>('categories'),
          getItems<Floor>('floors')
        ]);
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
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        // Update existing item
        await updateItem(activeTab, editingId, formData);
        if (activeTab === 'categories') {
          setCategories(prev => prev.map(cat => 
            cat.id === editingId ? { ...cat, ...formData } : cat
          ));
        } else {
          setFloors(prev => prev.map(floor => 
            floor.id === editingId ? { ...floor, ...formData } : floor
          ));
        }
      } else {
        // Add new item
        const newId = await addItem(activeTab, formData);
        const newItem = { id: newId, ...formData };
        if (activeTab === 'categories') {
          setCategories(prev => [...prev, newItem]);
        } else {
          setFloors(prev => [...prev, newItem]);
        }
      }
      
      setFormData({ name: '', description: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEdit = (item: Category | Floor) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || '' });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(activeTab, id);
      if (activeTab === 'categories') {
        setCategories(prev => prev.filter(cat => cat.id !== id));
      } else {
        setFloors(prev => prev.filter(floor => floor.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const currentItems = activeTab === 'categories' ? categories : floors;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Categories & Floors</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('floors')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'floors'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Floors
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({currentItems.length})
            </h2>
            
            <div className="space-y-3">
              {currentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Image 
                        src="/file.svg" 
                        alt="Item icon" 
                        width={16} 
                        height={16}
                        className="text-blue-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {currentItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No {activeTab} found. Add your first {activeTab.slice(0, -1)} using the form.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 