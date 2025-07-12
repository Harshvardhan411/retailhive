"use client";

import { useState } from 'react';
import { addItem, Shop, Offer } from '../../../utils/firebaseCrud';
import Image from 'next/image';

interface BulkUploadData {
  shops: Shop[];
  offers: Offer[];
}

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Please select a valid JSON file');
    }
  };

  const parseJSONFile = (file: File): Promise<BulkUploadData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          resolve(data);
        } catch {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  const uploadData = async (data: BulkUploadData) => {
    const totalItems = data.shops.length + data.offers.length;
    let uploadedCount = 0;

    // Upload shops first
    for (const shop of data.shops) {
      try {
        await addItem('shops', shop);
        uploadedCount++;
        setProgress((uploadedCount / totalItems) * 100);
      } catch {
        console.error('Error uploading shop:', shop.shopName);
      }
    }

    // Upload offers
    for (const offer of data.offers) {
      try {
        await addItem('offers', offer);
        uploadedCount++;
        setProgress((uploadedCount / totalItems) * 100);
      } catch {
        console.error('Error uploading offer:', offer.title);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage('');

    try {
      const data = await parseJSONFile(file);
      
      if (!data.shops || !data.offers) {
        throw new Error('JSON must contain "shops" and "offers" arrays');
      }

      await uploadData(data);
      setMessage(`Successfully uploaded ${data.shops.length} shops and ${data.offers.length} offers`);
      setFile(null);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const downloadTemplate = () => {
    const template = {
      shops: [
        {
          shopName: "Example Shop",
          ownerName: "John Doe",
          address: "123 Main St, City, State",
          contact: "+1234567890",
          category: "Electronics",
          floor: "Ground Floor"
        }
      ],
      offers: [
        {
          title: "Summer Sale",
          description: "Get 20% off on all electronics",
          discount: "20",
          shopId: "shop_id_here",
          validUntil: "2024-12-31"
        }
      ]
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-upload-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bulk Upload</h1>
        
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload JSON File</h2>
            <p className="text-gray-600 mb-4">
              Upload a JSON file containing shops and offers data. The file should have the following structure:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <pre className="text-sm text-gray-700">
{`{
  "shops": [
    {
      "shopName": "Shop Name",
      "ownerName": "Owner Name",
      "address": "Shop Address",
      "contact": "Contact Number",
      "category": "Category",
      "floor": "Floor"
    }
  ],
  "offers": [
    {
      "title": "Offer Title",
      "description": "Offer Description",
      "discount": "Discount Percentage",
      "shopId": "Shop ID",
      "validUntil": "YYYY-MM-DD"
    }
  ]
}`}
              </pre>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Image 
                src="/file.svg" 
                alt="Download" 
                width={20} 
                height={20}
                className="mr-2"
              />
              Download Template
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {uploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              !file || uploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Data'}
          </button>
        </div>
      </div>
    </div>
  );
} 