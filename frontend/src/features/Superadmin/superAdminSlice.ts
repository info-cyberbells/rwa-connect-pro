import { createSocietyAdminBySuperAdminService, createSocietyBySuperAdminService, getAllSocietiesSuperAdminService, getSocietyDetailsSuperAdminService } from "@/auth/authServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clear } from "console";

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
  },
});

export const { clearSocietyDetails, clearCreatedSociety } = superAdminSlice.actions;
export default superAdminSlice.reducer;