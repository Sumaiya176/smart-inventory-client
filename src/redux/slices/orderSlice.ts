// src/redux/slices/orderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
//import orderService from '@/services/order.service';
import { Order, CreateOrderData, UpdateOrderData, PaginatedResponse } from '@/types';
import orderService from '@/services/order.service';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status: string | null;
    startDate: string | null;
    endDate: string | null;
    search: string;
  };
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    status: null,
    startDate: null,
    endDate: null,
    search: '',
  },
};

// Async Thunks
export const fetchOrders = createAsyncThunk(
  'order/orders',
  async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => {
    const response = await orderService.getAllOrders(params);
    return response;
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: string) => {
    const response = await orderService.getOrderById(id);
    return response;
  }
);

export const createOrder = createAsyncThunk(
  '/order/create-order',
  async (orderData: CreateOrderData) => {
    const response = await orderService.createOrder(orderData);
    return response;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/update-order-status',
  async ({ id, status }: { id: string; status: Order['status'] }) => {
    const response = await orderService.updateOrderStatus(id, status);
    return response;
  }
);

export const updateOrder = createAsyncThunk(
  'order/update-order',
  async ({ id, data }: { id: string; data: UpdateOrderData }) => {
    const response = await orderService.updateOrder(id, data);
    return response;
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancel-order',
  async ({id, reason}:{id: string, reason: string}) => {
    const response = await orderService.cancelOrder({id, reason});
    return response;
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id: string) => {
    await orderService.deleteOrder(id);
    return id;
  }
);

export const fetchOrderStats = createAsyncThunk(
  'orders/fetchOrderStats',
  async (params?: { startDate?: string; endDate?: string }) => {
    const response = await orderService.getOrderStats(params);
    return response;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    setOrderFilters: (state, action: PayloadAction<Partial<OrderState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearOrderFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setOrderPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<PaginatedResponse<Order>>) => {
        console.log('Orders fetched successfully:', action.payload);
        state.loading = false;
        state.orders = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order';
      })
      
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      
      // Update Order
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      
      // Delete Order
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<string>) => {
        state.orders = state.orders.filter(o => o.id !== action.payload);
        if (state.selectedOrder?.id === action.payload) {
          state.selectedOrder = null;
        }
        state.pagination.total -= 1;
      });
  },
});

export const { 
  clearSelectedOrder, 
  setOrderFilters, 
  clearOrderFilters, 
  setOrderPage,
  clearOrderError 
} = orderSlice.actions;

export default orderSlice.reducer;