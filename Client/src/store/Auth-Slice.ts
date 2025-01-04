import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create axios instance with proper configs
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
});

interface AuthState {
  user: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null
};

export const login = createAsyncThunk('auth/login', async (payload: { email: string, password: string }) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
});

export const signin = createAsyncThunk('auth/signin', async (payload: { name: string, email: string, password: string }) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign in';
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to logout';
      });
  }
});

export default authSlice.reducer;