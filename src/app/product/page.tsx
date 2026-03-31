// frontend/src/app/products/page.tsx
'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { fetchProducts, deleteProduct } from '@/redux/slices/productSlice';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateProductModal from '@/components/product/CreateProductModal';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // This function runs after product is successfully created
  const handleProductCreated = () => {
    // Refresh the products list
    dispatch(fetchProducts({ page: 1, limit: 10 }));
    // You can also show a success message, update stats, etc.
    console.log('Product created successfully!');
  };

  // This closes the modal
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully');
        dispatch(fetchProducts({ page: 1, limit: 10 }));
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    product.stockQuantity <= product.minimumStockThreshold 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {product.stockQuantity} units
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'OUT_OF_STOCK'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <CreateProductModal
          onClose={handleCloseModal}
          onSuccess={handleProductCreated}
        />
      )}
    </div>
  );
}