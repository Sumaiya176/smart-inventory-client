// frontend/src/app/orders/page.tsx
'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { fetchOrders } from '@/redux/slices/orderSlice';
import CreateOrderModal from '@/components/order/CreateOrderModal';
import UpdateOrderStatus from '@/components/order/UpdateOrderStatus';
import { Plus, Eye, RefreshCw, Truck, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{ id: string; status: string } | null>(null);

  // This function runs after order is successfully created
  const handleOrderCreated = () => {
    // Refresh the orders list
    dispatch(fetchOrders({ page: 1, limit: 10 }));
    // You can also update dashboard stats, show notification, etc.
    console.log('Order created successfully!');
  };

  // This runs after order status is updated
  const handleOrderUpdated = () => {
    // Refresh the orders list to show updated status
    dispatch(fetchOrders({ page: 1, limit: 10 }));
    // You can also update analytics, etc.
    console.log('Order status updated!');
  };

  // Close the create modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Close the update status modal
  const handleCloseUpdateModal = () => {
    setSelectedOrder(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <RefreshCw className="w-4 h-4 text-yellow-500" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'SHIPPED': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'DELIVERED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customerName}</div>
                  <div className="text-xs text-gray-500">{order.customerEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedOrder({ id: order.id, status: order.status })}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="sr-only">Update Status</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Order Modal */}
      {isCreateModalOpen && (
        <CreateOrderModal
          onClose={handleCloseCreateModal}
          onSuccess={handleOrderCreated}
        />
      )}

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <UpdateOrderStatus
          orderId={selectedOrder.id}
          currentStatus={selectedOrder.status}
          onUpdate={handleOrderUpdated}
          onClose={handleCloseUpdateModal}
        />
      )}
    </div>
  );
}