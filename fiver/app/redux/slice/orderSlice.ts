import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface OrderState {
  loading: boolean;
  error: string | null;
  success: boolean;
  orders: Order[];
}

const initialState: OrderState = {
  loading: false,
  error: null,
  success: false,
  orders: [],
};

export interface Order {
  orderId: number;
  deadline: string;
  gigId: number;
  buyerId: number;
  sellerId: number;
  amount: number;
  orderStatus: string;
}

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData: { gigId: number; buyerId: number; sellerId: number; deadline: string; amount: number, file: any}, { rejectWithValue }) => {
      try {
       
        const token = localStorage.getItem('token');
        if (!token) {
          return rejectWithValue('Token is missing');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/createOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(orderData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create order');
        }
        return await response.json(); 
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to create order');
      }
    }
  );
  
export const fetchOrdersByUserId = createAsyncThunk(
    'orders/fetchOrdersByUserId',
    async (userId: number, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return rejectWithValue('Token is missing');
        }
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/getOrderById/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }
  
        return await response.json();
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch orders');
      }
    }
  );

  export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ orderId, orderStatus }: { orderId: number; orderStatus: string }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return rejectWithValue('Token is missing');
        }
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/updateOrderStatus/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ orderStatus }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update order status');
        }
  
        return await response.json(); 
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to update order status');
      }
    }
  );

  export const fetchOrdersByGigAndUserId = createAsyncThunk(
    'orders/fetchOrdersByGigAndUserId',
    async ({ gigId, userId }: { gigId: number; userId: number }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return rejectWithValue('Token is missing');
        }
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/orders/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ gigId }), 
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders by gig and user');
        }
  
        return await response.json();
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch orders by gig and user');
      }
    }
  );

  export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAllOrders',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return rejectWithValue('Token is missing');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/orders`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        return await response.json();
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch orders');
      }
    }
  );

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addNewOrder: (state, action) => {
        state.orders.push(action.payload); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrdersByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; 
      })
      .addCase(fetchOrdersByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.orders.findIndex(order => order.orderId === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrdersByGigAndUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByGigAndUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; 
      })
      .addCase(fetchOrdersByGigAndUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; 
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
      });
  },
});

export const { addNewOrder} = orderSlice.actions;
export default orderSlice.reducer;
