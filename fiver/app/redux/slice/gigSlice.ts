import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import { RootState } from '@/app/redux/store';

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

export interface Gig {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  video: string;
  userId: string;
}

export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (formData: FormData, thunkAPI) => {
    try {
      console.log(formData);
      const token = localStorage.getItem('token');

      if (!token) {
        return thunkAPI.rejectWithValue('Token is missing');
      }

      const id = jwtDecode<DecodedToken>(token).id;
      formData.append('userId', id);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/createGig`, {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/getAllGigs`, {
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

export const fetchGigsByUserId = createAsyncThunk(
  'gigs/fetchGigsByUserId',
  async (userId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return thunkAPI.rejectWithValue('Token is missing');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/getUserGigs/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user gigs');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteGig = createAsyncThunk(
  'gigs/deleteGig',
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return thunkAPI.rejectWithValue('Token is missing');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/deleteGig/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return id;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete gig');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateGig = createAsyncThunk(
  'gigs/editGig',
  async ({ id, formData }: { id: number, formData: FormData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return thunkAPI.rejectWithValue('Token is missing');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/updateGig/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data; 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to edit gig');
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
      })
      .addCase(fetchGigsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchGigsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.gigs = state.gigs.filter((gig) => gig.id !== action.payload);
      })
      .addCase(deleteGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGig.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.gigs.findIndex((gig) => gig.id === action.payload.id);
        if (index !== -1) {
          state.gigs[index] = action.payload;
        }
      })
      .addCase(updateGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectGigById = (state: RootState, gigId: number): Gig | undefined =>
  state.gigs.gigs.find((gig: Gig) => Number(gig.id) === gigId);

export default gigSlice.reducer;
