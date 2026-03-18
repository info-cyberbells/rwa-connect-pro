import { addNewSubscriptionPlanService, createSocietyAdminBySuperAdminService, createSocietyBySuperAdminService, deleteSubscriptionPlanService, getActiveSessionsService, getAllSocietiesSuperAdminService, getAllSubscriptionService, getSecurityInfoService, getSocietyDetailsSuperAdminService, revokeActiveSessionService, systemSettingsService, updateNotificationRulesService, updatePlatformConfigService, updateSubscriptionPlanService } from "@/auth/authServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

// CREATE SOCIETY BY SUPERADMIN THUNK
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

// CREATE SOCIETY ADMIN BY SUPERADMIN THUNK
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

// GET SECURITY INFO
export const getSecurityInfo = createAsyncThunk<any, void, {rejectValue: string}>(
  'superAdmin/getSecurityInfo',
  async(_, {rejectWithValue})=>{
    try {
      const response = await getSecurityInfoService();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to get securiy info.")
    }
  }
);

// GET ACTIVE SESSIONS
export const getActiveSessions = createAsyncThunk<any, void,{rejectValue: string}>(
  'superAdmin/getActiveSessions',
  async(_, {rejectWithValue})=>{
    try {
      const response = await getActiveSessionsService();
      return response; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to get active sessions");
    }
  }
);

// REVOKE ACTIVE SESSION
export const revokeActiveSession = createAsyncThunk<any, string,{rejectValue: string}>(
  "superAdmin/revokeActivesession",
  async(id, {rejectWithValue})=>{
    try {
      const response = await revokeActiveSessionService(id);
      return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to revoke active session.");
    }
  }
)

// SYSTEM SETTINGS THUNK
export const getSystemSettings = createAsyncThunk<any, void, {rejectValue: string}>(
  'superAdmin/systemSettings',
  async(_, {rejectWithValue}) => {
    try {
      const response = await systemSettingsService();
      return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to get system settings");
    }
  }
)

// UPDATE PLATFORM CONFIG
export const updatePlatformConfig = createAsyncThunk<any, any, {rejectValue: string}>(
  'superAdmin/upadtePlatformConfig',
  async(payload, {rejectWithValue})=>{
    try {
      const response = await updatePlatformConfigService(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update Platform Configuration"); 
    }
  }
)

// UPDATE PLATFORM CONFIG
export const updateNotificationRules = createAsyncThunk<any, any, {rejectValue: string}>(
  'superAdmin/upadteNotifRules',
  async(payload, {rejectWithValue})=>{
    try {
      const response = await updateNotificationRulesService(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update Platform Configuration"); 
    }
  }
)


// GET ALL SUBSCRIPTION PLANS 
export const getAllSubscriptionPlan = createAsyncThunk<any, void, {rejectValue: string}>(
  'superAdmin/GetAllSubscriptionPlan',
  async(_,{rejectWithValue})=>{
    try {
      const response = await getAllSubscriptionService();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to get Suscription Plan"); 
    }
  }
)

//ADD NEW SUBSCRIPTION PLAN
export const addSubscriptionPlan = createAsyncThunk<any, any, {rejectValue: string}>(
  'superAdmin/addSubscriptionPlan',
  async(payload,{rejectWithValue})=>{
    try {
      const response = await addNewSubscriptionPlanService(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add Suscription Plan"); 
    }
  }
)

//UPDATE SUBSCRIPTION PLAN
export const updateSubscriptionPlan = createAsyncThunk<any, any, {rejectValue: string}>(
  'superAdmin/updateSubscriptionPlan',
  async({id, payload},{rejectWithValue})=>{
    try {
      const response = await updateSubscriptionPlanService(id, payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update Suscription Plan"); 
    }
  }
)

//DELETE SUBSCRIPTION PAN
export const deleteSubscriptionPlan = createAsyncThunk<any, any, {rejectValue: string}>(
  'superAdmin/deleteSubscriptionPlan',
  async(id,{rejectWithValue})=>{
    try {
      const response = await deleteSubscriptionPlanService(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete Suscription Plan"); 
    }
  }
) 


const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    societies: [] as any[],
    count: 0,
    loading: false,
    error: null as string | null,
    error2: null as string | null,
    error3: null as string | null,
    societyDetails: null as any,
    loading2: false,
    loading3: false,
    createdSociety: {} as any,
    securityInfo: {} as any,
    activeSessions: {} as any,
    systemSettings: {} as any,
    subscriptionPlans: {} as any,
  },
  reducers: {
    clearSocietyDetails(state) {
        state.societyDetails = null;
    },
    clearCreatedSociety(state) {
      state.createdSociety = {};
    },
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

      // CREATE SOCIETY BY SUPERADMIN
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

      // CREATE SOCIETY ADMIN BY SUPERADMIN
      .addCase(createSocietyAdminBySuperAdmin.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(createSocietyAdminBySuperAdmin.fulfilled, (state)=>{
        state.loading = false;
      })
      .addCase(createSocietyAdminBySuperAdmin.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      })

      // get security info
      .addCase(getSecurityInfo.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(getSecurityInfo.fulfilled, (state, action)=>{
        state.loading = false;
        state.securityInfo = action.payload;
      })
      .addCase(getSecurityInfo.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      })

      // get active sesions
      .addCase(getActiveSessions.pending, (state)=>{
        state.loading3 = true;
        state.error3 = null;
      })
      .addCase(getActiveSessions.fulfilled, (state, action)=>{
        state.loading3 = false;
        state.activeSessions = action.payload;
      })
      .addCase(getActiveSessions.rejected, (state,action)=>{
        state.loading3 = false;
        state.error3 = action.payload as string;
      })

      .addCase(revokeActiveSession.pending, (state)=>{
        state.loading2 = true;
        state.error2 = null;
      })
      .addCase(revokeActiveSession.fulfilled, (state)=>{
        state.loading2 = false;
      })
      .addCase(revokeActiveSession.rejected, (state, action)=>{
        state.loading2 = false;
        state.error2 = action.payload as string; 
      })

      // system settings
      .addCase(getSystemSettings.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(getSystemSettings.fulfilled, (state, action)=>{
        state.loading = false;
        state.systemSettings = action.payload;
      })
      .addCase(getSystemSettings.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload;
      })

      // upadte paltforn configurations
      .addCase(updatePlatformConfig.pending, (state)=>{
        state.loading2 = true;
        state.error2 = null;
      })
      .addCase(updatePlatformConfig.fulfilled, (state)=>{
        state.loading2 = false;
      })
      .addCase(updatePlatformConfig.rejected, (state, action)=>{
        state.loading2 = false;
        state.error2 = action.payload;
      })

      // update notification rules
      .addCase(updateNotificationRules.pending, (state)=>{
        state.loading2 = true;
        state.error2 = null;
      })
      .addCase(updateNotificationRules.fulfilled, (state)=>{
        state.loading2 = false;
      })
      .addCase(updateNotificationRules.rejected, (state, action)=>{
        state.loading2 = false;
        state.error2 = action.payload;
      })

      // get all notification rules
      .addCase(getAllSubscriptionPlan.pending, (state)=>{
        state.loading3 = true;
        state.error3 = null;
      })
      .addCase(getAllSubscriptionPlan.fulfilled, (state, action)=>{
        state.loading3 = false;
        state.subscriptionPlans = action.payload;
      })
      .addCase(getAllSubscriptionPlan.rejected, (state, action)=>{
        state.loading3 = false;
        state.error3 = action.payload;
      })

      // add new plan 
      .addCase(addSubscriptionPlan.pending, (state)=>{
        state.loading2 = true;
        state.error3 = null;
      })
      .addCase(addSubscriptionPlan.fulfilled, (state, action)=>{
        state.loading2 = false;
      })
      .addCase(addSubscriptionPlan.rejected, (state, action)=>{
        state.loading2 = false;
        state.error3 = action.payload;
      })
      
      // update sunscription plan
      .addCase(updateSubscriptionPlan.pending, (state)=>{
        state.loading2 = true;
        state.error3 = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action)=>{
        state.loading2 = false;
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action)=>{
        state.loading2 = false;
        state.error3 = action.payload;
      })

      // delete subscription plan
      .addCase(deleteSubscriptionPlan.pending, (state)=>{
        state.loading2 = true;
        state.error3 = null;
      })
      .addCase(deleteSubscriptionPlan.fulfilled, (state, action)=>{
        state.loading2 = false;
      })
      .addCase(deleteSubscriptionPlan.rejected, (state, action)=>{
        state.loading2 = false;
        state.error3 = action.payload;
      })
      
  },
});

export const { clearSocietyDetails, clearCreatedSociety } = superAdminSlice.actions;
export default superAdminSlice.reducer;