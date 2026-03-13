  import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
  import authService, {
    LoginPayload,
    AuthResponse,
  } from "../auth/authServices";
  
  // ─── Types ────────────────────────────────────────────────────────────────────
  
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    society: string | null;
  }
  
  interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
  }
  
  // ─── Initial State ────────────────────────────────────────────────────────────
  
  const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("accessToken"),
    isLoading: false,
    error: null,
  };
  
  // ─── Async Thunks ─────────────────────────────────────────────────────────────
  
  export const login = createAsyncThunk<AuthResponse, LoginPayload>(
    "auth/login",
    async (payload, { rejectWithValue }) => {
      try {
        const data = await authService.login(payload);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.user.role);
        return data;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Login failed");
      }
    }
  );
  
  
  
  // ─── Slice ────────────────────────────────────────────────────────────────────
  
  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      clearError(state) {
        state.error = null;
      },
      resetAuth(state) {
        state.user = null;
        state.token = null;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      // ── Login ──
      builder
        .addCase(login.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        });
  
    
    },
  });
  
  export const { clearError, resetAuth } = authSlice.actions;
  export default authSlice.reducer;  