// frontend/src/components/orders/UpdateOrderStatus.tsx
'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks/useRedux';
import { updateOrderStatus, cancelOrder } from '@/redux/slices/orderSlice';
import toast from 'react-hot-toast';
import { Package, Truck, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: string;
  onUpdate: () => void;
  onClose: () => void;
}

const statuses = [
  { value: 'PENDING', label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { value: 'CONFIRMED', label: 'Confirmed', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
  { value: 'SHIPPED', label: 'Shipped', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
  { value: 'DELIVERED', label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { value: 'CANCELLED', label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
];

export default function UpdateOrderStatus({ orderId, currentStatus, onUpdate, onClose }: UpdateOrderStatusProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      toast.error('Status is already set to this value');
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: selectedStatus as 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' })).unwrap();
      toast.success(`Order status updated to ${statuses.find(s => s.value === selectedStatus)?.label}`);
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setLoading(true);
    try {
      await dispatch(cancelOrder({id: orderId, reason: cancelReason})).unwrap();
      toast.success('Order cancelled successfully');
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusFlow = () => {
    const currentIndex = statuses.findIndex(s => s.value === currentStatus);
    const nextStatuses = statuses.filter((_, index) => index > currentIndex && statuses[index].value !== 'CANCELLED');
    
    if (currentStatus === 'CANCELLED' || currentStatus === 'DELIVERED') {
      return [];
    }
    
    return nextStatuses;
  };

  const canCancel = currentStatus !== 'CANCELLED' && currentStatus !== 'DELIVERED';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Update Order Status</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Current Status</p>
            {(() => {
              const status = statuses.find(s => s.value === currentStatus);
              const Icon = status?.icon;
              return (
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${status?.bg}`}>
                  {Icon && <Icon className={`w-4 h-4 ${status?.color}`} />}
                  <span className={`text-sm font-medium ${status?.color}`}>{status?.label}</span>
                </div>
              );
            })()}
          </div>

          {/* Status Options */}
          {!showCancelConfirm ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  New Status
                </label>
                <div className="space-y-2">
                  {getStatusFlow().map((status) => {
                    const Icon = status.icon;
                    return (
                      <label
                        key={status.value}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedStatus === status.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          value={status.value}
                          checked={selectedStatus === status.value}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="text-blue-600"
                        />
                        <Icon className={`w-5 h-5 ${status.color}`} />
                        <span className="text-gray-900">{status.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Cancel Order Option */}
              {canCancel && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full text-left text-red-600 hover:text-red-700 font-medium"
                  >
                    Cancel Order
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    This will restore stock quantities and cannot be undone
                  </p>
                </div>
              )}

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
                  onClick={handleStatusUpdate}
                  disabled={loading || selectedStatus === currentStatus}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Cancel Order Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Please provide a reason for cancelling this order..."
                  autoFocus
                />
              </div>

              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium">Warning: This action cannot be undone</p>
                    <p className="text-xs mt-1">
                      Cancelling this order will restore all product stock quantities and cannot be reversed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}