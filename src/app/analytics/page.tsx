// frontend/src/app/analytics/page.tsx
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter,

} from 'lucide-react';
import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

export default function AnalyticsPage() {
  //const { user } = useAppSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState('week');


  // Sample data - replace with actual API calls
  const revenueData = [
    { date: '2026-07-28', revenue: 1200, orders: 8 },
    { date: '2026-07-29', revenue: 1500, orders: 12 },
    { date: '2026-07-30', revenue: 1800, orders: 15 },
    { date: '2026-07-31', revenue: 2100, orders: 18 },
    { date: '2026-08-01', revenue: 2500, orders: 22 },
    { date: '2026-08-02', revenue: 2200, orders: 19 },
    { date: '2026-08-03', revenue: 2800, orders: 25 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 4500 },
    { name: 'Grocery', value: 3200 },
    { name: 'Clothing', value: 2800 },
    { name: 'Books', value: 1500 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  const orderStatusData = [
    { name: 'Pending', value: 5 },
    { name: 'Confirmed', value: 8 },
    { name: 'Shipped', value: 12 },
    { name: 'Delivered', value: 25 },
    { name: 'Cancelled', value: 3 },
  ];

  const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

  const topProducts = [
    { name: 'iPhone 13', sales: 45, revenue: 31499.55 },
    { name: 'Samsung Galaxy S22', sales: 32, revenue: 19199.68 },
    { name: 'Wireless Headphones', sales: 28, revenue: 2519.72 },
    { name: 'Organic Rice 5kg', sales: 25, revenue: 324.75 },
    { name: 'Cotton T-Shirt', sales: 20, revenue: 399.80 },
  ];

  const monthlyStats = {
    totalRevenue: 84500,
    totalOrders: 342,
    averageOrderValue: 247.08,
    totalCustomers: 156,
    conversionRate: 4.2,
    growthRate: 12.5
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-500 mt-1">Track your business performance and insights</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Date Range:</span>
            </div>
            <div className="flex space-x-2">
              {['Today', 'Week', 'Month', 'Quarter', 'Year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range.toLowerCase())}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    dateRange === range.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <input
                type="date"
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                defaultValue="2026-07-28"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                defaultValue="2026-08-03"
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${monthlyStats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+{monthlyStats.growthRate}%</span>
                  <span className="text-xs text-gray-400 ml-2">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.totalOrders}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+8.5%</span>
                  <span className="text-xs text-gray-400 ml-2">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${monthlyStats.averageOrderValue.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+5.2%</span>
                  <span className="text-xs text-gray-400 ml-2">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.totalCustomers}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+15.3%</span>
                  <span className="text-xs text-gray-400 ml-2">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <div className="flex space-x-2">
                <button className="text-xs text-blue-600 hover:text-blue-700">Revenue</button>
                <button className="text-xs text-gray-400 hover:text-gray-600">Orders</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Orders by Category */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      <span className="text-sm text-gray-600">${product.revenue.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${(product.sales / topProducts[0].sales) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{product.sales} sales</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Conversion Rate</h4>
            <p className="text-2xl font-bold text-gray-900">{monthlyStats.conversionRate}%</p>
            <p className="text-xs text-gray-500 mt-2">2.1% higher than last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Acquisition</h4>
            <p className="text-2xl font-bold text-gray-900">45</p>
            <p className="text-xs text-gray-500 mt-2">12 new customers this week</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Return Rate</h4>
            <p className="text-2xl font-bold text-gray-900">2.3%</p>
            <p className="text-xs text-gray-500 mt-2">Below industry average</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}