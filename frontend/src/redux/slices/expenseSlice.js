import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expenseApi } from '../../services/api';
import { toast } from 'react-toastify';

// Async thunks
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getAll();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to fetch expenses');
      return rejectWithValue(error);
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  'expenses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getById(id);
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to fetch expense with ID: ${id}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchExpenseByProtocolNumber = createAsyncThunk(
  'expenses/fetchByProtocolNumber',
  async (protocolNumber, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getByProtocolNumber(protocolNumber);
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to fetch expense with protocol number: ${protocolNumber}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchExpensesByStatus = createAsyncThunk(
  'expenses/fetchByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getByStatus(status);
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to fetch expenses with status: ${status}`);
      return rejectWithValue(error);
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/create',
  async (expense, { rejectWithValue }) => {
    try {
      const response = await expenseApi.create(expense);
      toast.success('Expense created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to create expense');
      return rejectWithValue(error);
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, expense }, { rejectWithValue }) => {
    try {
      const response = await expenseApi.update(id, expense);
      toast.success('Expense updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || `Failed to update expense with ID: ${id}`);
      return rejectWithValue(error);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await expenseApi.delete(id);
      toast.success('Expense deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.message || `Failed to delete expense with ID: ${id}`);
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  expenses: [],
  currentExpense: null,
  filteredExpenses: [],
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearCurrentExpense: (state) => {
      state.currentExpense = null;
    },
    clearFilteredExpenses: (state) => {
      state.filteredExpenses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch expense by ID
      .addCase(fetchExpenseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExpense = action.payload;
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch expense by protocol number
      .addCase(fetchExpenseByProtocolNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseByProtocolNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExpense = action.payload;
      })
      .addCase(fetchExpenseByProtocolNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch expenses by status
      .addCase(fetchExpensesByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredExpenses = action.payload;
      })
      .addCase(fetchExpensesByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create expense
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
        state.currentExpense = action.payload;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update expense
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        );
        state.currentExpense = action.payload;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete expense
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
        if (state.currentExpense && state.currentExpense.id === action.payload) {
          state.currentExpense = null;
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentExpense, clearFilteredExpenses } = expenseSlice.actions;

export default expenseSlice.reducer;