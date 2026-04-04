// // frontend/src/app/orders/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
// import { fetchOrders } from '@/redux/slices/orderSlice';
// import CreateOrderModal from '@/components/order/CreateOrderModal';
// import UpdateOrderStatus from '@/components/order/UpdateOrderStatus';
// import { Plus, Eye, RefreshCw, Truck, CheckCircle, XCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import Button from '@/components/ui/Button';

// export default function OrdersPage() {
//   const dispatch = useAppDispatch();
//   const { orders, loading } = useAppSelector((state) => state.orders);
//   console.log('Orders in state:', orders,);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<{ id: string; status: string } | null>(null);

//   // This function runs after order is successfully created
//   const handleOrderCreated = () => {
//     // Refresh the orders list
//     dispatch(fetchOrders({ page: 1, limit: 10 }));
//     // You can also update dashboard stats, show notification, etc.
//     //console.log('Order fetched successfully!');
//   };

//   // This runs after order status is updated
//   const handleOrderUpdated = () => {
//     // Refresh the orders list to show updated status
//     dispatch(fetchOrders({ page: 1, limit: 10 }));
//     // You can also update analytics, etc.
//     console.log('Order status updated!');
//   };

//   // Close the create modal
//   const handleCloseCreateModal = () => {
//     setIsCreateModalOpen(false);
//   };

//   // Close the update status modal
//   const handleCloseUpdateModal = () => {
//     setSelectedOrder(null);
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'PENDING': return <RefreshCw className="w-4 h-4 text-yellow-500" />;
//       case 'CONFIRMED': return <CheckCircle className="w-4 h-4 text-blue-500" />;
//       case 'SHIPPED': return <Truck className="w-4 h-4 text-purple-500" />;
//       case 'DELIVERED': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
//       default: return null;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'PENDING': return 'bg-yellow-100 text-yellow-800';
//       case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
//       case 'SHIPPED': return 'bg-purple-100 text-purple-800';
//       case 'DELIVERED': return 'bg-green-100 text-green-800';
//       case 'CANCELLED': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchOrders({ page: 1, limit: 10 }));
//   }, [dispatch]);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
//         <Button onClick={() => setIsCreateModalOpen(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Create Order
//         </Button>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Order #
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Customer
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map((order) => (
//               <tr key={order.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {order.orderNumber}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{order.customerName}</div>
//                   <div className="text-xs text-gray-500">{order.customerEmail}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   ${order.totalAmount}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center space-x-1">
//                     {getStatusIcon(order.status)}
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button
//                     onClick={() => setSelectedOrder({ id: order.id, status: order.status })}
//                     className="text-blue-600 hover:text-blue-900"
//                   >
//                     <RefreshCw className="w-4 h-4" />
//                     <span className="sr-only">Update Status</span>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Create Order Modal */}
//       {isCreateModalOpen && (
//         <CreateOrderModal
//           onClose={handleCloseCreateModal}
//           onSuccess={handleOrderCreated}
//         />
//       )}

//       {/* Update Order Status Modal */}
//       {selectedOrder && (
//         <UpdateOrderStatus
//           orderId={selectedOrder.id}
//           currentStatus={selectedOrder.status}
//           onUpdate={handleOrderUpdated}
//           onClose={handleCloseUpdateModal}
//         />
//       )}
//     </div>
//   );
// }

// frontend/src/app/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { fetchOrders, updateOrderStatus, cancelOrder } from '@/redux/slices/orderSlice';
import CreateOrderModal from '@/components/order/CreateOrderModal';
import UpdateOrderStatus from '@/components/order/UpdateOrderStatus';
import Button from '@/components/ui/Button';
import { 
  Plus, Search, Filter, ChevronLeft, ChevronRight, 
  Eye, RefreshCw, Truck, CheckCircle, XCircle, Clock,
  Package, Download, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading, pagination } = useAppSelector((state) => state.orders);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{ id: string; status: string } | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrdersData();
  }, [currentPage, filters]);

  const fetchOrdersData = () => {
    dispatch(fetchOrders({
      page: currentPage,
      limit: 10,
      status: filters.status || undefined,
      search: filters.search || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters({ ...filters, status });
    setCurrentPage(1);
  };

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ status: '', search: '', startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'SHIPPED': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'DELIVERED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
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

  const exportOrders = () => {
    // Implement CSV export
    toast.success('Export started');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex space-x-3">
          {/* <Button variant="outline" onClick={exportOrders}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button> */}
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by order # or customer..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Date Range */}
          {/* <input
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
          /> */}
        </div>

        {(filters.status || filters.search || filters.startDate || filters.endDate) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Items
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-2 text-gray-500">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${Number(order.totalAmount).toFixed(2)}
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
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Update Status"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
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
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateOrderModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchOrdersData}
        />
      )}

      {selectedOrder && (
        <UpdateOrderStatus
          orderId={selectedOrder.id}
          currentStatus={selectedOrder.status}
          onUpdate={fetchOrdersData}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}