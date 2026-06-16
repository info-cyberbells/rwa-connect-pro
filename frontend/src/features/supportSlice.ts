import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  createSupportTicketService, 
  getMySupportTicketsService, 
  getAllSupportTicketsService, 
  getSupportTicketDetailsService, 
  addSupportTicketMessageService, 
  updateSupportTicketStatusService 
} from "../auth/authServices";

interface SupportState {
  tickets: any[];
  selectedTicket: any | null;
  messages: any[];
  isLoading: boolean;
  isSending: boolean;
  isError: boolean;
  message: string;
}

const initialState: SupportState = {
  tickets: [],
  selectedTicket: null,
  messages: [],
  isLoading: false,
  isSending: false,
  isError: false,
  message: "",
};

export const fetchAllTickets = createAsyncThunk(
  "support/fetchAll",
  async (params: any = {}, thunkAPI) => {
    try {
      return await getAllSupportTicketsService(params);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMyTickets = createAsyncThunk(
  "support/fetchMy",
  async (_, thunkAPI) => {
    try {
      return await getMySupportTicketsService();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchTicketDetails = createAsyncThunk(
  "support/fetchDetails",
  async (id: string, thunkAPI) => {
    try {
      return await getSupportTicketDetailsService(id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTicket = createAsyncThunk(
  "support/create",
  async (payload: any, thunkAPI) => {
    try {
      return await createSupportTicketService(payload);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addMessage = createAsyncThunk(
  "support/addMessage",
  async ({ id, payload }: { id: string; payload: any }, thunkAPI) => {
    try {
      return await addSupportTicketMessageService(id, payload);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateStatus = createAsyncThunk(
  "support/updateStatus",
  async ({ id, status }: { id: string; status: string }, thunkAPI) => {
    try {
      return await updateSupportTicketStatusService(id, { status });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    resetSupport: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.tickets;
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(fetchMyTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.tickets;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(fetchTicketDetails.fulfilled, (state, action) => {
        state.selectedTicket = action.payload.ticket;
        state.messages = action.payload.ticket.messages;
      })
      .addCase(createTicket.pending, (state) => {
        state.isSending = true;
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.isSending = false;
      })
      .addCase(createTicket.rejected, (state) => {
        state.isSending = false;
      })
      .addCase(addMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.selectedTicket = action.payload.ticket;
        state.messages = action.payload.ticket.messages;
      })
      .addCase(addMessage.rejected, (state) => {
        state.isSending = false;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.selectedTicket = action.payload.ticket;
      });
  },
});

export const { resetSupport, clearSelectedTicket } = supportSlice.actions;
export default supportSlice.reducer;
