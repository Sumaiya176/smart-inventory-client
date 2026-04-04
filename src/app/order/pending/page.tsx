// frontend/src/app/orders/pending/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { fetchOrders, updateOrderStatus } from '@/redux/slices/orderSlice';
import UpdateOrderStatus from '@/components/order/UpdateOrderStatus';
import { Clock, Truck, CheckCircle, Eye, RefreshCw, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PendingOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    dispatch(fetchOrders({ status: 'PENDING', limit: 100 }));
  }, [dispatch]);

  const handleBulkUpdate = async (orderIds: string[], status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') => {
    try {
      await Promise.all(
        orderIds.map(id => dispatch(updateOrderStatus({ id, status })).unwrap())
      );
      toast.success(`${orderIds.length} orders updated to ${status}`);
      dispatch(fetchOrders({ status: 'PENDING', limit: 100 }));
    } catch (error) {
      toast.error('Failed to update orders');
    }
  };

  const getPriorityBadge = (order: any) => {
    // Calculate priority based on order age
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 48) return { label: 'Urgent', color: 'bg-red-100 text-red-800' };
    if (hoursDiff > 24) return { label: 'High', color: 'bg-orange-100 text-orange-800' };
    if (hoursDiff > 12) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Normal', color: 'bg-green-100 text-green-800' };
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pending Orders</h1>
        <p className="text-gray-500 mt-1">Review and process pending customer orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 font-medium">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingOrders.length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Confirmed Orders</p>
              <p className="text-2xl font-bold text-blue-900">{confirmedOrders.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-800 font-medium">Ready to Ship</p>
              <p className="text-2xl font-bold text-purple-900">
                {orders.filter(o => o.status === 'CONFIRMED').length}
              </p>
            </div>
            <Truck className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Pending Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Orders Awaiting Processing</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-2 text-gray-500">Loading orders...</p>
                  </td>
                </tr>
              ) : pendingOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No pending orders</p>
                    <p className="text-sm text-gray-400 mt-1">All caught up!</p>
                  </td>
                </tr>
              ) : (
                pendingOrders.map((order) => {
                  const priority = getPriorityBadge(order);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${priority.color}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder({ id: order.id, status: order.status })}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 mr-2"
                        >
                          Process Order
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedOrder && (
        <UpdateOrderStatus
          orderId={selectedOrder.id}
          currentStatus={selectedOrder.status}
          onUpdate={() => {
            dispatch(fetchOrders({ status: 'PENDING', limit: 100 }));
            setSelectedOrder(null);
          }}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}