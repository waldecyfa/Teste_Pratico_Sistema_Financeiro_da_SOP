import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commitmentApi } from '../../services/api';
import { toast } from 'react-toastify';

// Async thunks
export const fetchCommitments = createAsyncThunk(
  'commitments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await commitmentApi.getAll();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to fetch commitments');
      return rejectWithValue(error);
    }
  }
);

export const fetchCommitmentById = createAsyncThunk(
  'commitments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await commitmentApi.getById(id);
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to fetch commitment with ID: ${id}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchCommitmentByNumber = createAsyncThunk(
  'commitments/fetchByNumber',
  async (commitmentNumber, { rejectWithValue }) => {
    try {
      const response = await commitmentApi.getByCommitmentNumber(commitmentNumber);
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to fetch commitment with number: ${commitmentNumber}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchCommitmentsByExpenseId = createAsyncThunk(
  'commitments/fetchByExpenseId',
  async (expenseId, { rejectWithValue }) => {
    try {
      const response = await commitmentApi.getByExpenseId(expenseId);
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to fetch commitments for expense ID: ${expenseId}`);
      return rejectWithValue(error);
    }
  }
);

export const createCommitment = createAsyncThunk(
  'commitments/create',
  async (commitment, { rejectWithValue }) => {
    try {
      const response = await commitmentApi.create(commitment);
      toast.success('Commitment created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to create commitment');
      return rejectWithValue(error);
    }
  }
);

export const updateCommitment = createAsyncThunk(
  'commitments/update',
  async ({ id, commitment }, { rejectWithValue }) => {
    try {
      const response = await commitmentApi.update(id, commitment);
      toast.success('Commitment updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to update commitment with ID: ${id}`);
      return rejectWithValue(error);
    }
  }
);

export const deleteCommitment = createAsyncThunk(
  'commitments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await commitmentApi.delete(id);
      toast.success('Commitment deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.message || `Failed to delete commitment with ID: ${id}`);
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  commitments: [],
  currentCommitment: null,
  expenseCommitments: [],
  loading: false,
  error: null,
};

const commitmentSlice = createSlice({
  name: 'commitments',
  initialState,
  reducers: {
    clearCurrentCommitment: (state) => {
      state.currentCommitment = null;
    },
    clearExpenseCommitments: (state) => {
      state.expenseCommitments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all commitments
      .addCase(fetchCommitments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommitments.fulfilled, (state, action) => {
        state.loading = false;
        state.commitments = action.payload;
      })
      .addCase(fetchCommitments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch commitment by ID
      .addCase(fetchCommitmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommitmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCommitment = action.payload;
      })
      .addCase(fetchCommitmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch commitment by number
      .addCase(fetchCommitmentByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommitmentByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCommitment = action.payload;
      })
      .addCase(fetchCommitmentByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch commitments by expense ID
      .addCase(fetchCommitmentsByExpenseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommitmentsByExpenseId.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseCommitments = action.payload;
      })
      .addCase(fetchCommitmentsByExpenseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create commitment
      .addCase(createCommitment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCommitment.fulfilled, (state, action) => {
        state.loading = false;
        state.commitments.push(action.payload);
        state.currentCommitment = action.payload;
        if (state.expenseCommitments.length > 0 && 
            state.expenseCommitments[0].expenseId === action.payload.expenseId) {
          state.expenseCommitments.push(action.payload);
        }
      })
      .addCase(createCommitment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update commitment
      .addCase(updateCommitment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommitment.fulfilled, (state, action) => {
        state.loading = false;
        state.commitments = state.commitments.map((commitment) =>
          commitment.id === action.payload.id ? action.payload : commitment
        );
        state.currentCommitment = action.payload;
        state.expenseCommitments = state.expenseCommitments.map((commitment) =>
          commitment.id === action.payload.id ? action.payload : commitment
        );
      })
      .addCase(updateCommitment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete commitment
      .addCase(deleteCommitment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommitment.fulfilled, (state, action) => {
        state.loading = false;
        state.commitments = state.commitments.filter((commitment) => commitment.id !== action.payload);
        if (state.currentCommitment && state.currentCommitment.id === action.payload) {
          state.currentCommitment = null;
        }
        state.expenseCommitments = state.expenseCommitments.filter(
          (commitment) => commitment.id !== action.payload
        );
      })
      .addCase(deleteCommitment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentCommitment, clearExpenseCommitments } = commitmentSlice.actions;

export default commitmentSlice.reducer;