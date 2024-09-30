import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  id: string;
}

export interface User {
  id: number;  
  name: string;
  profilePicture: string;
}

export interface Gig {
  id: number;
  title: string;
}

export interface Conversation {
  id: number;
  gig: Gig;
  buyer: User;
  seller: User;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  conversationId: number;
  createdAt: string;
}

export interface MessageState {
  loading: boolean;
  error: string | null;
  success: boolean;
  messages: Message[];
  conversation: Conversation[]; 
}

const initialState: MessageState = {
  loading: false,
  error: null,
  success: false,
  messages: [],
  conversation: [],
};

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async ({ receiverId, content, gigId, userID }: { receiverId: string; content: string; gigId: string , userID: string | null }, thunkAPI) => {
      try {
        
        const token = localStorage.getItem('token');
  
        if (!token) {
          return thunkAPI.rejectWithValue('Token is missing');
        }
  
        const senderId = jwtDecode<DecodedToken>(token).id;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            gigId,
            buyerId: senderId,
            sellerId: receiverId,
            content,
            userID
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send message');
        }
  
        const data = await response.json();
        return data; 
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return thunkAPI.rejectWithValue('Token is missing');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/messages/${conversationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch messages');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'messages/fetchConversation',
  async (gigId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return thunkAPI.rejectWithValue('Token is missing');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/conversations/${gigId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch conversation');
      }

      const data = await response.json();
      if (data.message) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addNewMessage: (state, action) => {
      state.messages.push(action.payload); 
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(sendMessage.pending, (state) => {
        state.error = null;
        state.success = false;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversation = action.payload;  
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
      });
      
  },
});

export const { addNewMessage } = messageSlice.actions;
export default messageSlice.reducer;
