import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'utils/axios/axios';

export const STATUS = Object.freeze({
    IDLE: "idle",
    ERROR: 'error',
    LOADING: "loading",
    SUCCESS: 'success',
    PENDING: 'pending'
});

const initialState = {
  posts: [],
  comments: {},
  status: STATUS.IDLE,
  error: null,
  likedPosts: [],
  likesInfo: {} 
};

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { dispatch, rejectWithValue }) => {
    try {
      console.log(postData);
      const response = await axiosInstance.post('/addPost', postData);
      dispatch(fetchPosts()); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('/getPosts');
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
);

export const fetchPostsByUser = createAsyncThunk(
  'posts/fetchPostsByUser',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/getPostsByUser?email=${email}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/deletePost/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'posts/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/getCommentsByPost?postId=${postId}`);
      return { postId, comments: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, text , userId}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/addComment', { postId, text, userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/deleteComment/${commentId}`, { data: { postId } });
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async ({postId, userId}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/posts/like`, {postId,userId});
      return { postId, like: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async ({postId, userId}, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/posts/like?postId=${postId}&userId=${userId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getLikesInfo = createAsyncThunk(
  'posts/getLikesInfo',
  async ({postId}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/likesInfo?postId=${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.status = STATUS.SUCCESS;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      })
      .addCase(fetchPostsByUser.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByUser.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      })
      .addCase(fetchComments.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.comments = {
          ...state.comments,
          [action.payload.postId]: action.payload.comments
        };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        const { postId, ...newComment } = action.payload;
        state.comments = {
          ...state.comments,
          [postId]: (state.comments[postId] || []).concat(newComment)
        };
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        const { postId, commentId } = action.payload;
        state.comments[postId] = state.comments[postId].filter(comment => comment.id !== commentId);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      })
      .addCase(likePost.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        const { postId } = action.payload;
        state.likedPosts = [...state.likedPosts, postId]; 
      })
      .addCase(likePost.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      })
      .addCase(unlikePost.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        const postId = action.payload;
        state.likedPosts = state.likedPosts.filter((id) => id !== postId); 
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      })
      .addCase(getLikesInfo.pending, (state) => {
        state.status = STATUS.PENDING;
      })
      .addCase(getLikesInfo.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        const { post, likedBy } = action.payload;
        state.posts = state.posts.map(p => 
          p.id === post.id ? { ...p, ...post } : p
        );
        state.likesInfo = {
          ...state.likesInfo,
          [post.id]: likedBy
        };
      })
      .addCase(getLikesInfo.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
