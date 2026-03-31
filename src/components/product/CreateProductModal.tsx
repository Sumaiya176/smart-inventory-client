// frontend/src/components/products/CreateProductModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { createProduct } from '@/redux/slices/productSlice';
import { fetchCategories } from '@/redux/slices/categorySlice';
import toast from 'react-hot-toast';
import { X, Package, DollarSign, AlertTriangle } from 'lucide-react';

interface CreateProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProductModal({ onClose, onSuccess }: CreateProductModalProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    categoryId: '',
    price: '',
    stockQuantity: '',
    minimumStockThreshold: '5',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const generateSKU = () => {
    const prefix = formData.name.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.stockQuantity) newErrors.stockQuantity = 'Stock quantity is required';
    else if (isNaN(Number(formData.stockQuantity)) || Number(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock must be a non-negative number';
    }
    if (!formData.minimumStockThreshold) newErrors.minimumStockThreshold = 'Threshold is required';
    else if (isNaN(Number(formData.minimumStockThreshold)) || Number(formData.minimumStockThreshold) < 0) {
      newErrors.minimumStockThreshold = 'Threshold must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await dispatch(createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        minimumStockThreshold: parseInt(formData.minimumStockThreshold),
        status: formData.status as 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED'
      })).unwrap();
      toast.success('Product created successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create Product</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className={`flex-1 px-3 py-2 border rounded-lg ${
                    errors.sku ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Product SKU"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sku: generateSKU() })}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Generate
                </button>
              </div>
              {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Stock *
              </label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.stockQuantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stockQuantity && <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span>Low Stock Threshold *</span>
                </div>
              </label>
              <input
                type="number"
                value={formData.minimumStockThreshold}
                onChange={(e) => setFormData({ ...formData, minimumStockThreshold: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.minimumStockThreshold ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="5"
              />
              {errors.minimumStockThreshold && (
                <p className="mt-1 text-sm text-red-600">{errors.minimumStockThreshold}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Product description (optional)"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}