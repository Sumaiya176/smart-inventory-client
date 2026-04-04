// frontend/src/app/activity-log/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
//import { fetchActivities } from '@/redux/slice/activitySlice';
import { 
  Activity, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Calendar,
  RefreshCw,
  Package,
  ShoppingCart,
  User,
  Tag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Eye,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchActivities } from '@/redux/slices/activitySlice';

interface ActivityLog {
  id: string;
  action: string;
  actionType: string;
  entityType: string;
  entityId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  metadata?: any;
  createdAt: string;
}

export default function ActivityLogPage() {
  const dispatch = useAppDispatch();
  const { activities, loading, pagination } = useAppSelector((state) => state.activities);
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [filters, setFilters] = useState({
    actionType: '',
    entityType: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('week');

  useEffect(() => {
    fetchActivitiesData();
  }, [currentPage, filters, dateRange]);

  const fetchActivitiesData = () => {
    let startDate = filters.startDate;
    let endDate = filters.endDate;
    
    if (dateRange !== 'custom') {
      const now = new Date();
      if (dateRange === 'today') {
        startDate = new Date().toISOString().split('T')[0];
        endDate = startDate;
      } else if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
      } else if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
      }
    }
    
    dispatch(fetchActivities({
      page: currentPage,
      limit: 20,
      actionType: filters.actionType || undefined,
      entityType: filters.entityType || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      search: filters.search || undefined
    }));
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'ORDER_CREATED':
        return <ShoppingCart className="w-5 h-5 text-green-500" />;
      case 'ORDER_UPDATED':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'ORDER_STATUS_CHANGED':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'ORDER_CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PRODUCT_CREATED':
        return <Package className="w-5 h-5 text-indigo-500" />;
      case 'PRODUCT_UPDATED':
        return <RefreshCw className="w-5 h-5 text-yellow-500" />;
      case 'PRODUCT_DELETED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PRODUCT_RESTOCKED':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'STOCK_UPDATED':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'ADDED_TO_RESTOCK_QUEUE':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'REMOVED_FROM_RESTOCK_QUEUE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CATEGORY_CREATED':
        return <Tag className="w-5 h-5 text-pink-500" />;
      case 'CATEGORY_UPDATED':
        return <Tag className="w-5 h-5 text-purple-500" />;
      case 'CATEGORY_DELETED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'USER_CREATED':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'USER_LOGIN':
        return <User className="w-5 h-5 text-green-500" />;
      case 'USER_LOGOUT':
        return <User className="w-5 h-5 text-gray-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'ORDER_CREATED':
        return 'bg-green-100 border-green-200';
      case 'ORDER_STATUS_CHANGED':
        return 'bg-purple-100 border-purple-200';
      case 'ORDER_CANCELLED':
        return 'bg-red-100 border-red-200';
      case 'PRODUCT_CREATED':
      case 'PRODUCT_RESTOCKED':
        return 'bg-indigo-100 border-indigo-200';
      case 'ADDED_TO_RESTOCK_QUEUE':
        return 'bg-yellow-100 border-yellow-200';
      case 'STOCK_UPDATED':
        return 'bg-orange-100 border-orange-200';
      case 'USER_LOGIN':
      case 'USER_CREATED':
        return 'bg-blue-100 border-blue-200';
      default:
        return 'bg-gray-100 border-gray-200';
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
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const exportActivities = () => {
    const exportData = activities.map((activity: any) => ({
      'Date': new Date(activity.createdAt).toLocaleString(),
      'Action': activity.action,
      'Type': activity.actionType,
      'Entity': activity.entityType,
      'User': activity.user?.name || 'System',
      'Details': JSON.stringify(activity.metadata || {})
    }));
    
    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Activities exported successfully');
  };

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ];
    return csvRows.join('\n');
  };

  const actionTypes = [
    { value: '', label: 'All Actions' },
    { value: 'ORDER_CREATED', label: 'Order Created' },
    { value: 'ORDER_STATUS_CHANGED', label: 'Order Status Changed' },
    { value: 'ORDER_CANCELLED', label: 'Order Cancelled' },
    { value: 'PRODUCT_CREATED', label: 'Product Created' },
    { value: 'PRODUCT_UPDATED', label: 'Product Updated' },
    { value: 'PRODUCT_DELETED', label: 'Product Deleted' },
    { value: 'STOCK_UPDATED', label: 'Stock Updated' },
    { value: 'ADDED_TO_RESTOCK_QUEUE', label: 'Added to Restock Queue' },
    { value: 'USER_LOGIN', label: 'User Login' },
    { value: 'USER_CREATED', label: 'User Created' },
  ];

  const entityTypes = [
    { value: '', label: 'All Entities' },
    { value: 'ORDER', label: 'Orders' },
    { value: 'PRODUCT', label: 'Products' },
    { value: 'CATEGORY', label: 'Categories' },
    { value: 'USER', label: 'Users' },
    { value: 'RESTOCK_QUEUE', label: 'Restock Queue' },
  ];

  const clearFilters = () => {
    setFilters({
      actionType: '',
      entityType: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setDateRange('week');
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
            <p className="text-gray-500 mt-1">
              Track all system activities and user actions
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportActivities}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={fetchActivitiesData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total || 0}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a : any) => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(a.createdAt) >= weekAgo;
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unique Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(activities.map((a: any) => a.userId)).size}
              </p>
            </div>
            <User className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Most Active</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {activities[0]?.user?.name || 'System'}
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Type Filter */}
          <select
            value={filters.actionType}
            onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {actionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Entity Type Filter */}
          <select
            value={filters.entityType}
            onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {entityTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Date Range Quick Select */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Range */}
        {dateRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="End Date"
            />
          </div>
        )}
      </div>

      {/* Activities Timeline */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activities found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Activity items */}
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <div key={activity.id} className="relative animate-fade-in">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-white border-2 border-blue-500 transform -translate-x-1/2 z-10"></div>
                  
                  {/* Activity card */}
                  <div className={`ml-12 bg-white rounded-lg shadow-sm border p-5 hover:shadow-md transition-shadow ${getActionColor(activity.actionType)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          {getActionIcon(activity.actionType)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {activity.action}
                            </span>
                            <span className="px-2 py-0.5 text-xs bg-white rounded-full text-gray-600">
                              {activity.actionType}
                            </span>
                            <span className="px-2 py-0.5 text-xs bg-white rounded-full text-gray-600">
                              {activity.entityType}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-2">
                            <span>By: {activity.user?.name || 'System'}</span>
                            {activity.user?.email && (
                              <span className="ml-2">({activity.user.email})</span>
                            )}
                          </div>
                          
                          {/* Metadata */}
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              <div className="font-medium text-gray-700 mb-1">Details:</div>
                              <pre className="text-gray-600 whitespace-pre-wrap">
                                {JSON.stringify(activity.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {/* Entity ID Link */}
                          <div className="mt-2">
                            <button
                              onClick={() => setSelectedActivity(activity)}
                              className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Entity Details
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Timestamp */}
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-sm text-gray-500 whitespace-nowrap">
                          {formatTime(activity.createdAt)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(activity.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} activities
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded-md ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
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

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Activity Details</h2>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Action</label>
                <p className="text-gray-900">{selectedActivity.action}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Action Type</label>
                  <p className="text-gray-900">{selectedActivity.actionType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Entity Type</label>
                  <p className="text-gray-900">{selectedActivity.entityType}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Entity ID</label>
                <p className="text-gray-900 font-mono text-sm">{selectedActivity.entityId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User</label>
                <p className="text-gray-900">
                  {selectedActivity.user?.name || 'System'} 
                  {selectedActivity.user?.email && ` (${selectedActivity.user.email})`}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Timestamp</label>
                <p className="text-gray-900">
                  {new Date(selectedActivity.createdAt).toLocaleString()}
                </p>
              </div>
              {selectedActivity.metadata && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Metadata</label>
                  <pre className="mt-1 p-3 bg-gray-50 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedActivity.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedActivity(null)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}