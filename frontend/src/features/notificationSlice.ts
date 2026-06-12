import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../auth/notificationService";

interface NotificationState {
  notifications: any[];
  unreadCount: number;
  stats: {
    unread: number;
    highPriority: number;
    read: number;
  };
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  stats: {
    unread: 0,
    highPriority: 0,
    read: 0
  },
  total: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isError: false,
  message: "",
};

export const fetchMyNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async ({ page, limit, category }: { page?: number, limit?: number, category?: string } = {}, thunkAPI) => {
    try {
      return await notificationService.getMyNotifications(page, limit, category);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchNotificationStats = createAsyncThunk(
  "notifications/fetchStats",
  async (_, thunkAPI) => {
    try {
      return await notificationService.getStats();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, thunkAPI) => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id: string, thunkAPI) => {
    try {
      return await notificationService.markAsRead(id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, thunkAPI) => {
    try {
      return await notificationService.markAllAsRead();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount;
        state.stats.unread = action.payload.unreadCount;
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.stats = {
          ...state.stats,
          ...action.payload.data
        };
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload.data._id);
        if (index !== -1) {
          state.notifications[index].isRead = true;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      });
  },
});

export const { resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
