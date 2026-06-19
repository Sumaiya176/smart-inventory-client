// src/redux/slices/authSlice.ts
import authService from '@/services/auth.service';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from 'cookies-next';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'VIEWER';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Login thunk
export const login = createAsyncThunk(
  '/user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authService.login(email, password);
    console.log('Login response:', response);

    // Set cookies for middleware
      
    setCookie('token', response.data.token, { maxAge: 60 * 60 * 24 * 7 });
    setCookie('userRole', response.data.userData.role, { maxAge: 60 * 60 * 24 * 7 });
    setCookie('userEmail', response.data.userData.email, { maxAge: 60 * 60 * 24 * 7 });
    return response;
  }
);

// Signup thunk
export const signup = createAsyncThunk(
  '/user/register',
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const response = await authService.signup(email, password, name);
    return response;
  }
);

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  // Clear cookies
  deleteCookie('token');
  deleteCookie('userRole');
  deleteCookie('userEmail');
  
  await authService.logout();
  return null;
});


export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const user = await authService.getCurrentUser();
    return user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // logout: (state) => {
    //   state.user = null;
    //   state.token = null;
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    // },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login successful:', action.payload);
        state.isLoading = false;
        state.user = action.payload.data.userData;
        state.token = action.payload.data.token;
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('user', JSON.stringify(action.payload.data.userData));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Signup failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;