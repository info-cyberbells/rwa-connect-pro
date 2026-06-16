import { 
  createSocietyAdminBySuperAdminService, 
  createSocietyBySuperAdminService, 
  getAllSocietiesSuperAdminService, 
  getSocietyDetailsSuperAdminService,
  getAllSupportTicketsService,
  getSupportTicketDetailsService,
  addSupportTicketMessageService,
  updateSupportTicketStatusService,
  updateMyPreferencesService,
  getAdminProfileService,
  updateAdminProfileService,
  changeMyPasswordService
} from "@/auth/authServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// SOCIETIES THUNKS
export const getAllSocietiesSuperAdminThunk = createAsyncThunk<
  any,
  void,
  { rejectValue: any }
>(
  "superAdmin/getAllSocieties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSocietiesSuperAdminService();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const viewSocietyDetailsBySuperAdminThunk = createAsyncThunk<any, string, { rejectValue: any }>(
    "superAdmin/viewSocietyDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getSocietyDetailsSuperAdminService(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const createSocietyBySuperAdmin = createAsyncThunk<any, any, { rejectValue: any }>(
    "superAdmin/createSociety",
    async(payload, { rejectWithValue}) => {
      try {
        const response = await createSocietyBySuperAdminService(payload);
        return response;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
      }
    }
);

export const createSocietyAdminBySuperAdmin = createAsyncThunk<any, any, {rejectValue: any}>(
  'superAdmin/createSocietyAdmin',
  async(payload, {rejectWithValue} ) => {
    try {
      const response = await createSocietyAdminBySuperAdminService(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// SUPPORT THUNKS
export const fetchAllSupportTickets = createAsyncThunk(
  "superAdmin/fetchAllSupportTickets",
  async (params: any = {}, { rejectWithValue }) => {
    try {
      return await getAllSupportTicketsService(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const fetchSupportTicketDetails = createAsyncThunk(
  "superAdmin/fetchSupportTicketDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getSupportTicketDetailsService(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const addSupportMessage = createAsyncThunk(
  "superAdmin/addSupportMessage",
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      return await addSupportTicketMessageService(id, payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "superAdmin/updateTicketStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      return await updateSupportTicketStatusService(id, { status });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// SETTINGS & PROFILE THUNKS
export const getSuperAdminProfile = createAsyncThunk(
  "superAdmin/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminProfileService();
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const updateSuperAdminProfile = createAsyncThunk(
  "superAdmin/updateProfile",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await updateAdminProfileService(payload);
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const updateSuperAdminPassword = createAsyncThunk(
  "superAdmin/updatePassword",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await changeMyPasswordService(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const updateSuperAdminPreferences = createAsyncThunk(
  "superAdmin/updatePreferences",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await updateMyPreferencesService(payload);
      return res.preferences;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);


const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    societies: [] as any[],
    count: 0,
    loading: false,
    error: null as string | null,
    societyDetails: null as any,
    loading2: false,
    createdSociety: {},
    
    // Support State
    tickets: [] as any[],
    selectedTicket: null as any,
    messages: [] as any[],
    societyStats: null as any,
    relatedTickets: [] as any[],
    supportLoading: false,
    isSending: false,

    // Settings State
    profile: null as any,
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    } as any,
    settingsLoading: false,
    isSaving: false,
  },
  reducers: {
    clearSocietyDetails(state) {
        state.societyDetails = null;
    },
    clearCreatedSociety(state) {
      state.createdSociety = {};
    },
    clearSelectedTicket(state) {
      state.selectedTicket = null;
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSocietiesSuperAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSocietiesSuperAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.societies = action.payload.societies;
        state.count = action.payload.count;
      })
      .addCase(getAllSocietiesSuperAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // View Society Details
      .addCase(viewSocietyDetailsBySuperAdminThunk.pending, (state) => {
        state.loading2 = true;
        state.error = null;
      })
      .addCase(viewSocietyDetailsBySuperAdminThunk.fulfilled, (state, action) => {
        state.loading2 = false;
        state.societyDetails = action.payload;
      })
      .addCase(viewSocietyDetailsBySuperAdminThunk.rejected, (state, action) => {
        state.loading2 = false;
        state.error = action.payload as string;
      })

      // CREATE SOCIETY
      .addCase(createSocietyBySuperAdmin.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(createSocietyBySuperAdmin.fulfilled, (state, action)=>{
        state.loading = false;
        state.createdSociety = action.payload;
      })
      .addCase(createSocietyBySuperAdmin.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      })

      // Support Tickets
      .addCase(fetchAllSupportTickets.pending, (state) => {
        state.supportLoading = true;
      })
      .addCase(fetchAllSupportTickets.fulfilled, (state, action) => {
        state.supportLoading = false;
        state.tickets = action.payload.tickets;
      })
      .addCase(fetchSupportTicketDetails.fulfilled, (state, action) => {
        state.selectedTicket = action.payload.ticket;
        state.messages = action.payload.ticket.messages;
        state.societyStats = action.payload.societyContext;
        state.relatedTickets = action.payload.relatedTickets;
      })
      .addCase(addSupportMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(addSupportMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.selectedTicket = action.payload.ticket;
        state.messages = action.payload.ticket.messages;
      })
      .addCase(addSupportMessage.rejected, (state) => {
        state.isSending = false;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.selectedTicket = action.payload.ticket;
      })

      // Profile & Settings
      .addCase(getSuperAdminProfile.pending, (state) => {
        state.settingsLoading = true;
      })
      .addCase(getSuperAdminProfile.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.profile = action.payload;
        if (action.payload.preferences) {
          state.preferences = action.payload.preferences;
        }
      })
      .addCase(updateSuperAdminProfile.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateSuperAdminProfile.fulfilled, (state, action) => {
        state.isSaving = false;
        state.profile = action.payload;
      })
      .addCase(updateSuperAdminProfile.rejected, (state) => {
        state.isSaving = false;
      })
      .addCase(updateSuperAdminPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  },
});

export const { clearSocietyDetails, clearCreatedSociety, clearSelectedTicket } = superAdminSlice.actions;
export default superAdminSlice.reducer;
