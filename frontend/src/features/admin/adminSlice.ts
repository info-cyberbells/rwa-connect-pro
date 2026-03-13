import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../auth/axiosInstance";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Society {
  _id: string;
  name: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  settings?: {
    maintenanceDueDay?: number;
    currency?: string;
    timezone?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  totalFloors?: number;
  totalUnits?: number;
  totalTowers?: number;
}

interface AdminState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  society: Society | null;
  selectedResident: any | null;
  residents: any[];
  profile: any | null;
  complaints: any[];
complaintStats: any;
  notices: any[];
  noticesLoading: boolean;
}
const initialState: AdminState = {
  isLoading: false,
  isSuccess: false,
  error: null,
  society: null,
  selectedResident: null,
  residents: [],
  profile: null,
  complaints: [],
  complaintStats: null,
  notices: [],
noticesLoading: false,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────
// addNewResident
export const addNewResident = createAsyncThunk(
  "admin/addNewResident",
  async (residentData: any, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/admin/users", residentData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);
// getMySociety
export const getMySociety = createAsyncThunk<Society>(
  "admin/getMySociety",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/admin/society", {
        headers: { "Cache-Control": "no-cache" },
        params: { ts: Date.now() },
      });
      return data.society || data.data || data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch society");
    }
  }
);
// getResidents
export const getResidents = createAsyncThunk(
  "admin/getResidents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/admin/users");
      return {
        users: data.users || [],
        count: data.count || 0
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load residents");
    }
  }
);
// getResidentById
export const getResidentById = createAsyncThunk(
  "admin/getResidentById",
  async (residentId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/admin/users/${residentId}`);
      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);
// updateResident
export const updateResident = createAsyncThunk(
  "admin/updateResident",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/users/${id}`, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);
// toggleResidentStatus

export const toggleResidentStatus = createAsyncThunk(
  "admin/toggleResidentStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/users/${id}/toggle-status`);
      return response.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);
// getAdminProfile
export const getAdminProfile = createAsyncThunk(
  "admin/getAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/profile");
      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);
// updateAdminProfile
export const updateAdminProfile = createAsyncThunk(
  "admin/updateAdminProfile",
  async (updatedData: any, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch("/profile", updatedData);
      return data.user; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);
// changePassword
export const changePassword = createAsyncThunk(
  "admin/changePassword",
  async (passwordData: any, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch("/profile/password", passwordData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Password change failed");
    }
  }
);

// getComplaints
export const getComplaints = createAsyncThunk(
  "admin/getComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/complaints");
      return data.complaints || data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch complaints");
    }
  }
);
// getComplaintStats
export const getComplaintStats = createAsyncThunk(
  "admin/getComplaintStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/complaints/stats");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
    }
  }
)
// updateComplaintStatus
export const updateComplaintStatus = createAsyncThunk(
  "admin/updateComplaintStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`/complaints/${id}/status`, {
        status
      });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);
// getNotices
export const getNotices = createAsyncThunk(
  "admin/getNotices",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/notices");
      return data.notices || data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notices");
    }
  }
);
export const createNotice = createAsyncThunk(
  "admin/createNotice",
  async (noticeData: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("title", noticeData.title);
      formData.append("description", noticeData.description);
      formData.append("category", noticeData.category);
      formData.append("priority", noticeData.priority);
      formData.append("visibleFrom", noticeData.visibleFrom);
      formData.append("visibleUntil", noticeData.visibleUntil);
      formData.append("isPinned", noticeData.isPinned);
      formData.append("targetAudience", noticeData.targetAudience);

      if (noticeData.images) {
        formData.append("images", noticeData.images);
      }

      const { data } = await axiosInstance.post("/notices", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create notice"
      );
    }
  }
);
// pinNotice (toggle)
export const pinNotice = createAsyncThunk(
  "admin/pinNotice",
  async (noticeId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`/notices/${noticeId}/pin`);
      return data.notice || data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to pin notice");
    }
  }
);
// deleteNotice
export const deleteNotice = createAsyncThunk(
  "admin/deleteNotice",
  async (noticeId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/notices/${noticeId}`);
      return noticeId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete notice"
      );
    }
  }
);
// updateNotice
export const updateNotice = createAsyncThunk(
  "admin/updateNotice",
  async (
    { id, noticeData }: { id: string; noticeData: any },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      formData.append("title", noticeData.title);
      formData.append("description", noticeData.description);
      formData.append("category", noticeData.category);
      formData.append("priority", noticeData.priority);
      formData.append("visibleFrom", noticeData.visibleFrom);
      formData.append("visibleUntil", noticeData.visibleUntil);
      formData.append("isPinned", noticeData.isPinned);
      formData.append("targetAudience", noticeData.targetAudience);

      if (noticeData.images) {
        formData.append("images", noticeData.images);
      }

      const { data } = await axiosInstance.patch(
        `/notices/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return data.notice || data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update notice"
      );
    }
  }
);
// ─── Slice ────────────────────────────────────────────────────────────────────
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
        state.profile = null; 
  
        

    },
  },
  extraReducers: (builder) => {
    builder
      // Add Resident
      .addCase(addNewResident.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(addNewResident.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addNewResident.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get My Society
      .addCase(getMySociety.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMySociety.fulfilled, (state, action: PayloadAction<Society>) => {
        state.isLoading = false;
        state.society = action.payload;
        state.error = null;
      })
      .addCase(getMySociety.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Residents List
      .addCase(getResidents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResidents.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.residents = action.payload.users;
      })
      .addCase(getResidents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Resident Details
      .addCase(getResidentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedResident = action.payload;
      })

      // Update Resident
      .addCase(updateResident.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })

      // Toggle Status
      .addCase(toggleResidentStatus.fulfilled, (state, action: any) => {
        const updatedUser = action.payload;
        const index = state.residents.findIndex((res) => res._id === updatedUser._id);
        if (index !== -1) {
          state.residents[index].isActive = updatedUser.isActive;
        }
      })

  // --- getAdminProfile ---
  .addCase(getAdminProfile.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })
  .addCase(getAdminProfile.fulfilled, (state, action: PayloadAction<any>) => {
    state.isLoading = false;
    state.profile = action.payload;
  })
  .addCase(getAdminProfile.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
  })

  // --- updateAdminProfile ---
  .addCase(updateAdminProfile.pending, (state) => {
    state.isLoading = true;
    state.error = null;
    state.isSuccess = false;
  })
  .addCase(updateAdminProfile.fulfilled, (state, action: PayloadAction<any>) => {
    state.isLoading = false;
    state.profile = action.payload; // update profile in state
    state.isSuccess = true;
  })
  .addCase(updateAdminProfile.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
    state.isSuccess = false;
  })
  // --- changePassword ---
.addCase(changePassword.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})

.addCase(changePassword.fulfilled, (state) => {
  state.isLoading = false;
  state.isSuccess = true;
})

.addCase(changePassword.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
  state.isSuccess = false;
})


// getComplaints
.addCase(getComplaints.pending, (state) => {
  state.isLoading = true;
})
.addCase(getComplaints.fulfilled, (state, action: PayloadAction<any[]>) => {
  state.isLoading = false;
  state.complaints = action.payload;
})
.addCase(getComplaints.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
// getComplaintStats
.addCase(getComplaintStats.pending, (state) => {
  state.isLoading = true;
})
.addCase(getComplaintStats.fulfilled, (state, action: PayloadAction<any>) => {
  state.isLoading = false;
  state.complaintStats = action.payload;
})
.addCase(getComplaintStats.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})


// updateComplaintStatus
.addCase(updateComplaintStatus.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})

.addCase(updateComplaintStatus.fulfilled, (state, action: any) => {
  state.isLoading = false;

  const updatedComplaint = action.payload.complaint;

  const index = state.complaints.findIndex(
    (c: any) => c._id === updatedComplaint._id
  );

  if (index !== -1) {
    state.complaints[index] = updatedComplaint;
  }
})

.addCase(updateComplaintStatus.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
// getNotices
.addCase(getNotices.pending, (state) => {
  state.noticesLoading = true;
})
.addCase(getNotices.fulfilled, (state, action: PayloadAction<any[]>) => {
  state.noticesLoading = false;
  state.notices = action.payload;
})
.addCase(getNotices.rejected, (state, action) => {
  state.noticesLoading = false;
  state.error = action.payload as string;
})

.addCase(createNotice.pending, (state) => {
  state.isLoading = true;
})

.addCase(createNotice.fulfilled, (state) => {
  state.isLoading = false;
  state.isSuccess = true;
})

.addCase(createNotice.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
// pinNotice
.addCase(pinNotice.pending, (state) => {
  state.isLoading = true;
})
.addCase(pinNotice.fulfilled, (state, action: PayloadAction<any>) => {
  state.isLoading = false;
  const updated = action.payload;
  const index = state.notices.findIndex((n: any) => n._id === updated._id);
  if (index !== -1) {
    state.notices[index] = updated;
  }
})
.addCase(pinNotice.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
// deleteNotice
.addCase(deleteNotice.pending, (state) => {
  state.isLoading = true;
})
.addCase(deleteNotice.fulfilled, (state, action: PayloadAction<string>) => {
  state.isLoading = false;

  state.notices = state.notices.filter(
    (notice: any) => notice._id !== action.payload
  );
})
.addCase(deleteNotice.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
// updateNotice
.addCase(updateNotice.pending, (state) => {
  state.isLoading = true;
})
.addCase(updateNotice.fulfilled, (state, action: PayloadAction<any>) => {
  state.isLoading = false;

  const updated = action.payload;

  const index = state.notices.findIndex(
    (n: any) => n._id === updated._id
  );

  if (index !== -1) {
    state.notices[index] = updated;
  }
})
.addCase(updateNotice.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})

  }
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;