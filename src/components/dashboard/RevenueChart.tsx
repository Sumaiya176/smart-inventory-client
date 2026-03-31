// src/components/dashboard/RevenueChart.tsx
'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch revenue data
    const fetchData = async () => {
      // Sample data - replace with API call
      const sampleData = [
        { date: 'Mon', revenue: 1200 },
        { date: 'Tue', revenue: 1900 },
        { date: 'Wed', revenue: 1500 },
        { date: 'Thu', revenue: 2100 },
        { date: 'Fri', revenue: 2400 },
        { date: 'Sat', revenue: 1800 },
        { date: 'Sun', revenue: 1300 },
      ];
      setData(sampleData as any);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}