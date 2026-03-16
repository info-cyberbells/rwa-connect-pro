import { changeMyPasswordService, getAllActiveNoticesService, getAllNoticesByUserService, getFilterNoticesByUserService, getMyAllChargesServices, getMyComplaintDetailService, getMyComplaintsService, getMyProfileService, getMySingleChargeService, getSingleNoticeByUserService, getUserPaymentHistoryService, submitComplaintService, updateMyProfileService, userSubmitPaymentService } from "@/auth/authServices";
import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";


interface UserState {
  profileData: any;
  loading: boolean;
  singleLoading: boolean,
  error: string | null;
  singleViewError: string | null;
  submitError: string | null;
  notices: any[];
  singleNotice: any[];
  myCharges: any[];
  chargeDetails: any[];
  paymentHistory: any[];
  myComplaints: any[];
  complaintDetails: any[];
}

const initialState: UserState = {
  profileData: null,
  loading: false,
  singleLoading: false,
  error: null,
  singleViewError: null,
  submitError: null,
  notices: [],
  singleNotice: [],
  myCharges: [],
  chargeDetails: [],
  paymentHistory: [],
  myComplaints: [],
  complaintDetails: [],
};

// GET MY PROFILE THUNK
export const getMyProfile = createAsyncThunk< any,void, { rejectValue: string }>(
    "user/getMyProfile",
 async (_, { rejectWithValue }) => {
  try {
    const response = await getMyProfileService();
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

// UPDATE MY PROFILE THUNK
export const updateMyProfile = createAsyncThunk<any,any, { rejectValue: string } >(
    "user/updateMyProfile", 
async (payload, { rejectWithValue }) => {
  try {
    const response = await updateMyProfileService(payload);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update profile"
    );
  }
});

// CHNANGE PASSWORD THUNK
export const changeMyPassword = createAsyncThunk< any, any, { rejectValue: string }>(
    "user/changeMyPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await changeMyPasswordService(payload);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to change password"
    );
  }
});

// USER GET ALL NOTICES THUNK
export const getAllUserNoticesThunk = createAsyncThunk<any, void, { rejectValue: string }>(
    'user/getAllUserNotices', 
    async (_, { rejectWithValue })=>{
        try {
            const response = await getAllNoticesByUserService();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get all notices");
        }
    }
);

// USER GET NOTICES BY FILTER
export const getFilteredNoticesThunk = createAsyncThunk<any, string, { rejectValue: string }>(
    'user/getFilterNotices',
    async(category, { rejectWithValue })=>{
        try {
            const response = await getFilterNoticesByUserService(category);
            return response
        } catch (error: any) {
            return rejectWithValue(
                    error.response?.data?.message || "Failed to fetch notices");
        }
    }
)

//GET SINGLE NOTICE IN DETAIL
export const getSingleNotice = createAsyncThunk<any, string, { rejectValue: string}>(
    'user/getSingleNotices',
    async(id, {rejectWithValue})=>{
        try {
            const response = await getSingleNoticeByUserService(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get notice details.")
        }
    }
);

//GET ALL ACTIVE NOTICES
export const getAllActiveNotices = createAsyncThunk<any, void, { rejectValue: string }>(
  "user/getAllActiveNotices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllActiveNoticesService();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get active notices"
      );
    }
  }
);

// USER GET MY ALL CHARGES
export const getMyAllCharges = createAsyncThunk<any, Record<string, any> | void, {rejectValue: string}>(
    'user/getMyAllCharges',
    async (filters: Record<string, any> = {}, {rejectWithValue}) => {
        try {
            const response = await getMyAllChargesServices(filters);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get ALL charges");
        }
    }
)

//USER GET SINGLE CHARGE DETAILS
export const getSingleChargeDetails = createAsyncThunk<any, string, { rejectValue: string }>(
    'user/getMyChargeDetails',
    async(id, {rejectWithValue})=>{
        try {
            const response = await getMySingleChargeService(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get charge details");
        }
    }
);

// USER GET PAYMENT HISTORY
export const getUserPayemntHistory = createAsyncThunk<any, Record<string, any> | void,{rejectValue: string}>(
    'user/getUserPaymentHistory',
    async(filters: Record<string, any> = {}, {rejectWithValue})=>{
        try {
            const response = await getUserPaymentHistoryService(filters);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get payment history");
        }
    }
);

//USER SUBMIT PAYMENT
export const userSubmitPayment = createAsyncThunk<any, FormData,{rejectValue: string}>(
    'user/submitPayment',
    async(payload, {rejectWithValue})=>{
        try {
            const response = await userSubmitPaymentService(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to submit payment details");
        }
    }
);

//USER GET MY ALL COMPLAINNTS 
export const getMyComplaints = createAsyncThunk<any, Record<string, any> | void, {rejectValue: string}>(
    'user/getMyComplaints',
    async(filters: Record<string, any> = {}, {rejectWithValue}) =>{
        try {
            const response = await getMyComplaintsService(filters);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get complaints");
        }
    }
)

//USER VIEW COMPLAINT DETAILS
export const viewComplaintDetails = createAsyncThunk<any, string, { rejectValue: string}>(
    'user/viewComplaintDetails',
    async(id, {rejectWithValue})=>{
        try {
            const response = await getMyComplaintDetailService(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get complaits details");
        }
    }
)

//USER SUBMIT COMPLAINTS
export const submitComplaint = createAsyncThunk<any, FormData, {rejectValue: string}>(
    'user/sumitComplaint',
    async(payload, {rejectWithValue} )=>{
        try {
            const response = await submitComplaintService(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to submit complaint");
        }
    }
)


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        clearChargeDetails: (state) => {
            state.chargeDetails = [];
        },
        clearSingleNotice: (state) => {
            state.singleNotice = [];
        }
    },
    extraReducers: (builder) => {
        builder

        .addCase(getMyProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getMyProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profileData = action.payload.user || action.payload;
        })
        .addCase(getMyProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Error fetching profile";
        })

        .addCase(updateMyProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateMyProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profileData = action.payload.user || action.payload;
        })
        .addCase(updateMyProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Error updating profile";
        })

        .addCase(changeMyPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(changeMyPassword.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(changeMyPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Error changing password";
        })

        .addCase(getAllUserNoticesThunk.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllUserNoticesThunk.fulfilled, (state, action)=>{
            state.loading = false;
            state.notices = action.payload.notices || action.payload;
        })
        .addCase(getAllUserNoticesThunk.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload || "Failed to get All Notices";
        })

        .addCase(getFilteredNoticesThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getFilteredNoticesThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.notices = action.payload.notices || action.payload;
        })
        .addCase(getFilteredNoticesThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        })

        .addCase(getAllActiveNotices.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllActiveNotices.fulfilled, (state, action) => {
            state.loading = false;
            state.notices = action.payload.notices || action.payload;
        })
        .addCase(getAllActiveNotices.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        })
        //GET SINGLE NOTICE
        .addCase(getSingleNotice.pending, (state)=>{
            state.singleLoading = true;
            state.error = null;
        })
        .addCase(getSingleNotice.fulfilled, (state, action)=>{
            state.singleLoading = false;
            state.singleNotice = action.payload.notice;
        })
        .addCase(getSingleNotice.rejected, (state, action)=>{
            state.singleLoading = false;
            state.error = action.payload;
        })

        // GET MY ALL CHARGES
        .addCase(getMyAllCharges.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getMyAllCharges.fulfilled, (state, action)=>{
            state.loading = false;
            state.myCharges = action.payload;
        })
        .addCase(getMyAllCharges.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(getSingleChargeDetails.pending, (state)=>{
            state.singleLoading = true;
            state.error = null;
        })
        .addCase(getSingleChargeDetails.fulfilled, (state, action)=>{
            state.singleLoading = false;
            state.chargeDetails = action.payload;
        })
        .addCase(getSingleChargeDetails.rejected, (state, action)=>{
            state.singleLoading = false;
            state.error = action.payload;
        })

        // getPayemnt history
        .addCase(getUserPayemntHistory.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getUserPayemntHistory.fulfilled, (state, action)=>{
            state.loading = false;
            state.paymentHistory = action.payload;
        })
        .addCase(getUserPayemntHistory.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        // user submit payment
        .addCase(userSubmitPayment.pending, (state)=>{
            state.singleLoading = true;
            state.submitError = null;
        })
        .addCase(userSubmitPayment.fulfilled, (state)=>{
            state.singleLoading = false;
        })
        .addCase(userSubmitPayment.rejected, (state,action)=>{
            state.singleLoading = false;
            state.submitError = action.payload;
        })

        // user get my complaints
        .addCase(getMyComplaints.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getMyComplaints.fulfilled, (state, action)=>{
            state.loading = false;
            state.myComplaints = action.payload;
        })
        .addCase(getMyComplaints.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        // USER VIEW COMPLAINT DETAILS
        .addCase(viewComplaintDetails.pending, (state)=>{
            state.singleLoading = true;
            state.singleViewError = null;
        })
        .addCase(viewComplaintDetails.fulfilled, (state, action)=>{
            state.singleLoading = false;
            state.complaintDetails = action.payload.complaint;
        })
        .addCase(viewComplaintDetails.rejected, (state, action)=>{
            state.singleLoading = true;
            state.singleViewError = action.payload;
        })

        // USER SUBMIT COMPLAINT
        .addCase(submitComplaint.pending, (state)=>{
            state.singleLoading = true;
            state.submitError = null;
        })
        .addCase(submitComplaint.fulfilled, (state)=>{
            state.singleLoading = false;
        })
        .addCase(submitComplaint.rejected, (state, action)=>{
            state.singleLoading = false;
            state.submitError = action.payload;
        })

    }
})

export const { clearChargeDetails, clearSingleNotice } = userSlice.actions;
export default userSlice.reducer;