import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentApi } from '../../services/api';
import { toast } from 'react-toastify';

// Async thunks
export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getAll();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to fetch payments');
      return rejectWithValue(error);
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getById(id);
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to fetch payment with ID: ${id}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchPaymentByNumber = createAsyncThunk(
  'payments/fetchByNumber',
  async (paymentNumber, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getByPaymentNumber(paymentNumber);
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to fetch payment with number: ${paymentNumber}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchPaymentsByCommitmentId = createAsyncThunk(
  'payments/fetchByCommitmentId',
  async (commitmentId, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getByCommitmentId(commitmentId);
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to fetch payments for commitment ID: ${commitmentId}`);
      return rejectWithValue(error);
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/create',
  async (payment, { rejectWithValue }) => {
    try {
      const response = await paymentApi.create(payment);
      toast.success('Payment created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to create payment');
      return rejectWithValue(error);
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payments/update',
  async ({ id, payment }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.update(id, payment);
      toast.success('Payment updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to update payment with ID: ${id}`);
      return rejectWithValue(error);
    }
  }
);

export const deletePayment = createAsyncThunk(
  'payments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await paymentApi.delete(id);
      toast.success('Payment deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.message || `Failed to delete payment with ID: ${id}`);
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  payments: [],
  currentPayment: null,
  commitmentPayments: [],
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearCommitmentPayments: (state) => {
      state.commitmentPayments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch payment by ID
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch payment by number
      .addCase(fetchPaymentByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch payments by commitment ID
      .addCase(fetchPaymentsByCommitmentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentsByCommitmentId.fulfilled, (state, action) => {
        state.loading = false;
        state.commitmentPayments = action.payload;
      })
      .addCase(fetchPaymentsByCommitmentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
        state.currentPayment = action.payload;
        if (state.commitmentPayments.length > 0 && 
            state.commitmentPayments[0].commitmentId === action.payload.commitmentId) {
          state.commitmentPayments.push(action.payload);
        }
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update payment
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        );
        state.currentPayment = action.payload;
        state.commitmentPayments = state.commitmentPayments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        );
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete payment
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.filter((payment) => payment.id !== action.payload);
        if (state.currentPayment && state.currentPayment.id === action.payload) {
          state.currentPayment = null;
        }
        state.commitmentPayments = state.commitmentPayments.filter(
          (payment) => payment.id !== action.payload
        );
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPayment, clearCommitmentPayments } = paymentSlice.actions;

export default paymentSlice.reducer;