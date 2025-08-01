import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './slices/expenseSlice';
import commitmentReducer from './slices/commitmentSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    commitments: commitmentReducer,
    payments: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});