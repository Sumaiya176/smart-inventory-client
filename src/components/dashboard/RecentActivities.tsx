// src/components/dashboard/RecentActivities.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks/useRedux';
import { 
  Activity, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  RefreshCw,
  User,
  Tag,
  Archive
} from 'lucide-react';
import Link from 'next/link';

interface Activity {
  id: string;
  action: string;
  actionType: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName?: string;
  createdAt: string;
  metadata?: any;
}

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Simulate API call - replace with actual API
      const mockActivities: Activity[] = [
        {
          id: '1',
          action: 'Order #ORD-1734567890 created',
          actionType: 'ORDER_CREATED',
          entityType: 'ORDER',
          entityId: 'order_1',
          userId: 'user_1',
          userName: 'John Doe',
          createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
          metadata: { totalAmount: 789.98, items: 2 }
        },
        {
          id: '2',
          action: 'Stock updated for "iPhone 13"',
          actionType: 'STOCK_UPDATED',
          entityType: 'PRODUCT',
          entityId: 'product_1',
          userId: 'user_3',
          userName: 'Admin User',
          createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
          metadata: { previousStock: 15, newStock: 12 }
        },
        {
          id: '3',
          action: 'Product "Wireless Headphones" added to Restock Queue',
          actionType: 'ADDED_TO_RESTOCK_QUEUE',
          entityType: 'RESTOCK_QUEUE',
          entityId: 'queue_1',
          userId: 'system',
          userName: 'System',
          createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
          metadata: { priority: 'HIGH', currentStock: 2 }
        },
        {
          id: '4',
          action: 'Order #ORD-1734567889 marked as Shipped',
          actionType: 'ORDER_STATUS_CHANGED',
          entityType: 'ORDER',
          entityId: 'order_2',
          userId: 'user_2',
          userName: 'Manager User',
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
          metadata: { oldStatus: 'CONFIRMED', newStatus: 'SHIPPED' }
        },
        {
          id: '5',
          action: 'New category "Electronics" created',
          actionType: 'CATEGORY_CREATED',
          entityType: 'CATEGORY',
          entityId: 'cat_1',
          userId: 'user_3',
          userName: 'Admin User',
          createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
        },
        {
          id: '6',
          action: 'Product "Samsung Galaxy S22" restocked',
          actionType: 'PRODUCT_RESTOCKED',
          entityType: 'PRODUCT',
          entityId: 'product_2',
          userId: 'user_3',
          userName: 'Admin User',
          createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
          metadata: { addedQuantity: 10, newStock: 18 }
        },
        {
          id: '7',
          action: 'Low stock alert for "Cotton T-Shirt"',
          actionType: 'ADDED_TO_RESTOCK_QUEUE',
          entityType: 'RESTOCK_QUEUE',
          entityId: 'queue_2',
          userId: 'system',
          userName: 'System',
          createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
          metadata: { priority: 'MEDIUM', currentStock: 3 }
        },
        {
          id: '8',
          action: 'User "Manager User" logged in',
          actionType: 'USER_LOGIN',
          entityType: 'USER',
          entityId: 'user_2',
          userId: 'user_2',
          userName: 'Manager User',
          createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
        },
      ];

      setActivities(mockActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'ORDER_CREATED':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />;
      case 'ORDER_UPDATED':
        return <RefreshCw className="w-5 h-5 text-yellow-500" />;
      case 'ORDER_STATUS_CHANGED':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'ORDER_CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PRODUCT_CREATED':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'PRODUCT_UPDATED':
        return <RefreshCw className="w-5 h-5 text-yellow-500" />;
      case 'PRODUCT_RESTOCKED':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'STOCK_UPDATED':
        return <Archive className="w-5 h-5 text-indigo-500" />;
      case 'ADDED_TO_RESTOCK_QUEUE':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'REMOVED_FROM_RESTOCK_QUEUE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CATEGORY_CREATED':
        return <Tag className="w-5 h-5 text-pink-500" />;
      case 'USER_LOGIN':
        return <User className="w-5 h-5 text-gray-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'ORDER_CREATED':
        return 'bg-blue-100';
      case 'ORDER_STATUS_CHANGED':
        return 'bg-purple-100';
      case 'ORDER_CANCELLED':
        return 'bg-red-100';
      case 'PRODUCT_CREATED':
      case 'PRODUCT_RESTOCKED':
        return 'bg-green-100';
      case 'ADDED_TO_RESTOCK_QUEUE':
        return 'bg-orange-100';
      case 'STOCK_UPDATED':
        return 'bg-indigo-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.actionType.toLowerCase().includes(filter);
  });

  const actionTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'order', label: 'Orders' },
    { value: 'product', label: 'Products' },
    { value: 'stock', label: 'Stock' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <p className="text-sm text-gray-500 mt-1">
              Latest system actions and updates
            </p>
          </div>
          <button
            onClick={fetchActivities}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {actionTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === type.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary-600"></div>
            <p className="mt-2 text-gray-500">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activities found</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${getActivityColor(activity.actionType)}`}>
                  {getActivityIcon(activity.actionType)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 ml-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(activity.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      by {activity.userName || 'System'}
                    </span>
                    
                    {activity.metadata && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex space-x-1">
                          {activity.metadata.totalAmount && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              ${activity.metadata.totalAmount}
                            </span>
                          )}
                          {activity.metadata.items && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {activity.metadata.items} items
                            </span>
                          )}
                          {activity.metadata.priority && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              activity.metadata.priority === 'HIGH' 
                                ? 'bg-red-100 text-red-700'
                                : activity.metadata.priority === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {activity.metadata.priority} Priority
                            </span>
                          )}
                          {activity.metadata.addedQuantity && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              +{activity.metadata.addedQuantity} units
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons (appear on hover) */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/${activity.entityType.toLowerCase()}s/${activity.entityId}`}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <Link
          href="/activity-log"
          className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All Activities
        </Link>
      </div>
    </div>
  );
}