"use client";

import { useState, useEffect } from 'react';
import { getItems, updateItem, deleteItem, User } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface AdminUser extends User {
  role?: string;
  status?: string;
  approved?: boolean;
}

export default function ApproveAdminsPage() {
  const [pendingAdmins, setPendingAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingAdmins = async () => {
      try {
        const users = await getItems<AdminUser>('users');
        const pending = users.filter(user => user.role === 'admin' && !user.approved);
        setPendingAdmins(pending);
      } catch (error) {
        console.error('Error fetching pending admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAdmins();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await updateItem('users', userId, { approved: true, status: 'active' });
      setPendingAdmins(prev => prev.filter(admin => admin.id !== userId));
    } catch (error) {
      console.error('Error approving admin:', error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await deleteItem('users', userId);
      setPendingAdmins(prev => prev.filter(admin => admin.id !== userId));
    } catch (error) {
      console.error('Error rejecting admin:', error);
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Approve Admin Users</h1>
        
        {pendingAdmins.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <Image 
              src="/file.svg" 
              alt="No pending admins" 
              width={64} 
              height={64}
              className="mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Admins</h3>
            <p className="text-gray-600">All admin requests have been processed.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingAdmins.map((admin) => (
              <div key={admin.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Image 
                        src="/file.svg" 
                        alt="User avatar" 
                        width={24} 
                        height={24}
                        className="text-gray-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{admin.name}</h3>
                      <p className="text-gray-600">{admin.email}</p>
                      {admin.address && (
                        <p className="text-sm text-gray-500">{admin.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(admin.id!)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(admin.id!)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
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