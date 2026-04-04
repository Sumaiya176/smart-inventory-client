// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import StatsCard from '@/components/dashboard/StatsCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentActivities from '@/components/dashboard/RecentActivities';
import { Package, ShoppingCart, AlertTriangle, DollarSign } from 'lucide-react';
import { fetchDashboardMetrics } from '@/redux/slices/dashboardSlice';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { metrics, loading } = useAppSelector((state) => state.dashboard);
  console.log("Dashboard metrics:", metrics); 
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    fetchDashboardMetrics();
    // Only run on client-side
    setCurrentDateTime(new Date().toLocaleString());
  }, []);

  useEffect(() => {
   dispatch(fetchDashboardMetrics());
   const interval = setInterval(() => {
     dispatch(fetchDashboardMetrics());
     setCurrentDateTime(new Date().toLocaleString());
   }, 60000);   
    return () => clearInterval(interval); 
  }, [dispatch]);

  const refreshDashboard = () => {
    Promise.all([
      dispatch(fetchDashboardMetrics()),
      // You can add more dispatches here if you have other data to refresh
      // e.g., dispatch(fetchRecentActivities()), dispatch(fetchRevenueTrends()), etc.    
      ]);}

  const stats = [
    {
      title: 'Total Orders Today',
      value: metrics?.totalOrdersToday || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Revenue Today',
      value: `$${Number(metrics?.totalRevenueToday)?.toFixed(2) || 0}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Low Stock Items',
      value: metrics?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-3%',
    },
    {
      title: 'Total Products',
      value: metrics?.totalProducts || 0,
      icon: Package,
      color: 'bg-purple-500',
      change: '+5%',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {currentDateTime || 'Loading...'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Overview</h3>
          <div className="flex items-center justify-center h-64 text-gray-400">
            Order status chart coming soon
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivities />
    </div>
  );
}