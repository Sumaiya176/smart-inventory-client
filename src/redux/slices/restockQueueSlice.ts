// frontend/src/redux/slices/restockQueueSlice.ts
import restockQueueService from '@/services/restockQueue.service';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface RestockItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    category: {
      name: string;
    };
    stockQuantity: number;
    minimumStockThreshold: number;
  };
  currentStock: number;
  threshold: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  addedAt: string;
  resolvedAt?: string;
}

interface RestockQueueState {
  queueItems: RestockItem[];
  selectedItem: RestockItem | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: RestockQueueState = {
  queueItems: [],
  selectedItem: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

// Async Thunks
export const fetchRestockQueue = createAsyncThunk(
  'restockQueue/fetchRestockQueue',
  async (params?: {
    page?: number;
    limit?: number;
    priority?: string;
  }) => {
    const response = await restockQueueService.getQueue(params);
    return response;
  }
);

export const fetchRestockQueueItem = createAsyncThunk(
  'restockQueue/fetchRestockQueueItem',
  async (id: string) => {
    const response = await restockQueueService.getQueueItem(id);
    return response;
  }
);

export const updateRestockQuantity = createAsyncThunk(
  'restockQueue/updateRestockQuantity',
  async ({ itemId, productId, quantity }: { itemId: string; productId: string; quantity: number }) => {
    const response = await restockQueueService.updateStock(productId, quantity);
    return { itemId, response };
  }
);

export const removeFromQueue = createAsyncThunk(
  'restockQueue/removeFromQueue',
  async (itemId: string) => {
    await restockQueueService.removeFromQueue(itemId);
    return itemId;
  }
);

export const bulkRestock = createAsyncThunk(
  'restockQueue/bulkRestock',
  async ({ itemIds, quantity }: { itemIds: string[]; quantity: number }) => {
    const response = await restockQueueService.bulkRestock(itemIds, quantity);
    return response;
  }
);

export const getQueueStats = createAsyncThunk(
  'restockQueue/getQueueStats',
  async () => {
    const response = await restockQueueService.getStats();
    return response;
  }
);

const restockQueueSlice = createSlice({
  name: 'restockQueue',
  initialState,
  reducers: {
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Restock Queue
      .addCase(fetchRestockQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestockQueue.fulfilled, (state, action) => {
        console.log('Fetched Restock Queue:', action.payload);
        state.loading = false;
        state.queueItems = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchRestockQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch restock queue';
      })
      
      // Update Restock Quantity
      .addCase(updateRestockQuantity.fulfilled, (state, action) => {
        state.queueItems = state.queueItems.filter(
          item => item.id !== action.payload.itemId
        );
        state.pagination.total -= 1;
      })
      
      // Remove from Queue
      .addCase(removeFromQueue.fulfilled, (state, action) => {
        state.queueItems = state.queueItems.filter(
          item => item.id !== action.payload
        );
        state.pagination.total -= 1;
      })
      
      // Bulk Restock
      .addCase(bulkRestock.fulfilled, (state, action) => {
        state.queueItems = state.queueItems.filter(
          item => !action.payload.removedIds.includes(item.id)
        );
        state.pagination.total -= action.payload.removedIds.length;
      });
  }
});

export const { clearSelectedItem, clearError } = restockQueueSlice.actions;
export default restockQueueSlice.reducer;