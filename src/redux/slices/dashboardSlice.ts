// src/redux/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
//import dashboardService from '@/services/dashboard.service';
import { DashboardMetrics, ActivityLog } from '@/types';
import dashboardService from '@/services/dashboard.service';

interface DashboardState {
  metrics: DashboardMetrics | null;
  recentActivities: ActivityLog[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  recentActivities: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async Thunks
export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/metrics',
  async (params?: { date?: string; startDate?: string; endDate?: string }) => {
    const response = await dashboardService.getMetrics(params);
    return response;
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (limit: number = 10) => {
    const response = await dashboardService.getRecentActivities(limit);
    return response;
  }
);

export const fetchRevenueChart = createAsyncThunk(
  'dashboard/fetchRevenueChart',
  async (days: number = 7) => {
    const response = await dashboardService.getRevenueChart(days);
    return response;
  }
);

export const fetchOrderStatusStats = createAsyncThunk(
  'dashboard/fetchOrderStatusStats',
  async () => {
    const response = await dashboardService.getOrderStatusStats();
    return response;
  }
);

export const refreshDashboard = createAsyncThunk(
  'dashboard/refresh',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchDashboardMetrics()),
      dispatch(fetchRecentActivities(10)),
      dispatch(fetchRevenueChart(7)),
      dispatch(fetchOrderStatusStats()),
    ]);
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      state.metrics = null;
      state.recentActivities = [];
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Metrics
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action: PayloadAction<DashboardMetrics>) => {
        console.log('Dashboard metrics fetched successfully:', action.payload);   
        state.loading = false;
        state.metrics = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard metrics';
      })
      
      // Fetch Recent Activities
      .addCase(fetchRecentActivities.fulfilled, (state, action: PayloadAction<ActivityLog[]>) => {
        state.recentActivities = action.payload;
      })
      
      // Refresh Dashboard
      .addCase(refreshDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshDashboard.fulfilled, (state) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(refreshDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to refresh dashboard';
      });
  },
});

export const { clearDashboardError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;