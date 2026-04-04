// frontend/src/redux/slices/activitySlice.ts
import activityService from '@/services/activity.service';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
//import activityService from '@/service/activity.service';

interface Activity {
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

interface ActivityState {
  activities: Activity[];
  selectedActivity: Activity | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ActivityState = {
  activities: [],
  selectedActivity: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  }
};

// Async Thunks
export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (params?: {
    page?: number;
    limit?: number;
    actionType?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => {
    const response = await activityService.getActivities(params);
    return response;
  }
);

export const fetchActivityById = createAsyncThunk(
  'activities/fetchActivityById',
  async (id: string) => {
    const response = await activityService.getActivityById(id);
    return response;
  }
);

export const exportActivities = createAsyncThunk(
  'activities/exportActivities',
  async (params?: any) => {
    const response = await activityService.exportActivities(params);
    return response;
  }
);

const activitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    clearSelectedActivity: (state) => {
      state.selectedActivity = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activities';
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.selectedActivity = action.payload;
      });
  }
});

export const { clearSelectedActivity, clearError } = activitySlice.actions;
export default activitySlice.reducer;