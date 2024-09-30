import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
interface RatingState {
    loading: boolean;
    error: string | null;
    success: boolean;
    ratings: Rating[];
    averageRating: number;
}

const initialState: RatingState = {
    loading: false,
    error: null,
    success: false,
    ratings: [],
    averageRating: 0,
};

export interface Rating {
    id: number;
    ratingValue: number; 
    buyerId: number;
    sellerId: number;
    orderId: number;
    averageRating: number;
}

export const createRating = createAsyncThunk(
    'ratings/createRating',
    async (ratingData: { ratingValue: number; buyerId: number; sellerId: number; orderId: number; raterId: number }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Token is missing');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/createRating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(ratingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create rating');
            }
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create rating');
        }
    }
);

export const fetchRatingsByOrderId = createAsyncThunk(
    'ratings/fetchRatingsByOrderId',
    async ({orderId , userId, role}: { orderId: number; userId: number; role: string}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Token is missing');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/ratings/${orderId}?userId=${userId}&role=${role}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch ratings');
            }
            return await response.json();
        } catch (error: any) {   
            return rejectWithValue(error.message || 'Failed to fetch ratings');
        }
    }
);

export const fetchAverageRating = createAsyncThunk(
    'userRatings/fetchAverageRating',
    async ({ userId, role }: { userId: number; role: string | null }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Token is missing');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/rating/${userId}?role=${role}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch average rating');
            }
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch average rating');
        }
    }
);

const ratingSlice = createSlice({
    name: 'ratings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRating.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.ratings = action.payload.ratingValue;
            })
            .addCase(createRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchRatingsByOrderId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRatingsByOrderId.fulfilled, (state, action) => {
                state.loading = false;
                state.ratings = action.payload;
            })
            .addCase(fetchRatingsByOrderId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAverageRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAverageRating.fulfilled, (state, action) => {
                state.loading = false;
                state.averageRating = action.payload.averageRating;
            })
            .addCase(fetchAverageRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default ratingSlice.reducer;
