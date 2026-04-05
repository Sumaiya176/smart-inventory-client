// frontend/src/app/restock-queue/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { 
  fetchRestockQueue, 
  updateRestockQuantity, 
  removeFromQueue,
  bulkRestock 
} from '@/redux/slices/restockQueueSlice';
import { fetchProducts } from '@/redux/slices/productSlice';
import toast from 'react-hot-toast';
import { 
  AlertTriangle, 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Truck,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface RestockItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    category: {
      name: string;
    };
    stockQuantity: number;
    minimumStockThreshold: number;
  };
  currentStock: number;
  threshold: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  addedAt: string;
  resolvedAt?: string;
}

// --- NEW SUB-COMPONENT FOR THE ROW ---
interface RestockRowProps {
  item: any;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRestock: (id: string, productId: string, qty: number) => void;
  onRemove: (id: string, name: string) => void;
  getStockStatus: (stock: number, threshold: number) => any;
  getPriorityIcon: (priority: string) => ReactNode;
  getPriorityColor: (priority: string) => string;
}

const RestockTableRow = ({ 
  item, 
  isSelected, 
  onToggleSelect, 
  onRestock, 
  onRemove, 
  getStockStatus,
  getPriorityIcon,
  getPriorityColor 
}: RestockRowProps) => {
  // ✅ Hook is now at the top level of a component
  const [restockQty, setRestockQty] = useState(
    item.threshold - item.currentStock + 10
  );

  const stockStatus = getStockStatus(item.currentStock, item.threshold);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(item.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
        <div className="text-sm text-gray-500">{item.product.sku}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {item.product.category.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {item.currentStock}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {item.threshold}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
          {getPriorityIcon(item.priority)}
          <span className="ml-1">{item.priority}</span>
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
          {stockStatus.text}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setRestockQty(Math.max(0, restockQty - 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={restockQty}
            onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)}
            className="w-16 text-center border border-gray-300 rounded-md py-1"
          />
          <button 
            onClick={() => setRestockQty(restockQty + 1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <button
          onClick={() => onRestock(item.id, item.productId, restockQty)}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          Update
        </button>
        <button
          onClick={() => onRemove(item.id, item.product.name)}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default function RestockQueuePage() {
  const dispatch = useAppDispatch();
  const { queueItems, loading, pagination } = useAppSelector((state) => state.restockQueue);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [restockQuantities, setRestockQuantities] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<'all' | 'HIGH' | 'MEDIUM' | 'LOW'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkRestockModalOpen, setIsBulkRestockModalOpen] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(0);

  useEffect(() => {
    fetchQueueData();
  }, [currentPage, filter]);

  const fetchQueueData = () => {
    dispatch(fetchRestockQueue({
      page: currentPage,
      limit: 10,
      priority: filter === 'all' ? undefined : filter
    }));
  };

  const handleRestock = async (itemId: string, productId: string, quantity: number) => {
    if (quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      await dispatch(updateRestockQuantity({ 
        itemId, 
        productId, 
        quantity 
      })).unwrap();
      toast.success('Stock updated successfully');
      fetchQueueData();
      dispatch(fetchProducts({ page: 1, limit: 10 }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update stock');
    }
  };

  const handleRemoveFromQueue = async (itemId: string, productName: string) => {
    if (confirm(`Remove ${productName} from restock queue?`)) {
      try {
        await dispatch(removeFromQueue(itemId)).unwrap();
        toast.success('Item removed from queue');
        fetchQueueData();
      } catch (error: any) {
        toast.error(error.message || 'Failed to remove item');
      }
    }
  };

  const handleBulkRestock = async () => {
    if (bulkQuantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      await dispatch(bulkRestock({
        itemIds: selectedItems,
        quantity: bulkQuantity
      })).unwrap();
      toast.success(`${selectedItems.length} items restocked successfully`);
      setSelectedItems([]);
      setBulkQuantity(0);
      setIsBulkRestockModalOpen(false);
      fetchQueueData();
      dispatch(fetchProducts({ page: 1, limit: 10 }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to bulk restock');
    }
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'MEDIUM':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'LOW':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStockStatus = (currentStock: number, threshold: number) => {
    if (currentStock <= 2) return { text: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
    if (currentStock <= threshold) return { text: 'Low', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const filteredItems = queueItems.filter(item =>
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: queueItems.length,
    high: queueItems.filter(i => i.priority === 'HIGH').length,
    medium: queueItems.filter(i => i.priority === 'MEDIUM').length,
    low: queueItems.filter(i => i.priority === 'LOW').length,
    estimatedCost: queueItems.reduce((sum, item) => 
      sum + (item.product.price * (item.threshold - item.currentStock + 5)), 0
    )
  };

   useEffect(() => {
   dispatch(fetchRestockQueue({ page: 1, limit: 10 }));
 }, [dispatch]);
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Restock Queue</h1>
            <p className="text-gray-500 mt-1">
              Manage products that need to be reordered
            </p>
          </div>
          {selectedItems.length > 0 && (
            <button
              onClick={() => setIsBulkRestockModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Truck className="w-4 h-4 mr-2" />
              Bulk Restock ({selectedItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total to Restock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.high}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Medium Priority</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Priority</p>
              <p className="text-2xl font-bold text-green-600">{stats.low}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Est. Restock Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.estimatedCost.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex space-x-2">
            {['all', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => (
              <button
                key={priority}
                onClick={() => setFilter(priority as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === priority
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {priority === 'all' ? 'All' : priority}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchQueueData}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Restock Queue Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading restock queue...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">No items in restock queue</p>
            <p className="text-sm text-gray-400 mt-1">
              All products have sufficient stock
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredItems.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Threshold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restock Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                 {filteredItems.map((item) => (
                <RestockTableRow
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onToggleSelect={toggleSelectItem}
                  onRestock={handleRestock}
                  onRemove={handleRemoveFromQueue}
                  getStockStatus={getStockStatus}
                  getPriorityIcon={getPriorityIcon}
                  getPriorityColor={getPriorityColor}
                />
              ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} items
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bulk Restock Modal */}
      {isBulkRestockModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Bulk Restock</h2>
              <button
                onClick={() => setIsBulkRestockModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Restock {selectedItems.length} items with the same quantity?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restock Quantity
                </label>
                <input
                  type="number"
                  value={bulkQuantity}
                  onChange={(e) => setBulkQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quantity"
                  min="1"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsBulkRestockModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkRestock}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Confirm Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}