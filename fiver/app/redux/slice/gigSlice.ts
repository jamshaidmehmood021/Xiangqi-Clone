import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/app/redux/store';
import { jwtDecode } from 'jwt-decode';

interface GigState {
  loading: boolean;
  error: string | null;
  success: boolean;
  gigs: any[];
}

const initialState: GigState = {
  loading: false,
  error: null,
  success: false,
  gigs: [],
};

interface DecodedToken {
  id: string;
}

export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (formData: FormData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return thunkAPI.rejectWithValue('Token is missing');
      }

      const id = jwtDecode<DecodedToken>(token).id;
      formData.append('userId', id);

      const response = await fetch('http://localhost:5000/createGig', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create gig');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAllGigs = createAsyncThunk(
  'gigs/fetchAllGigs',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return thunkAPI.rejectWithValue('Token is missing');
      }

      const response = await fetch('http://localhost:5000/getAllGigs', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch gigs');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const gigSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGig.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.gigs.push(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(fetchAllGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchAllGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default gigSlice.reducer;
