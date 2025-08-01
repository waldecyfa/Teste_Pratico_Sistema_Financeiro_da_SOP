import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle specific error cases
    if (response && response.data) {
      return Promise.reject({
        status: response.status,
        message: response.data.message || 'An error occurred',
        errorCode: response.data.errorCode,
        errors: response.data.errors,
      });
    }
    
    // Handle network errors
    return Promise.reject({
      message: 'Network error. Please check your connection.',
    });
  }
);

export default api;

// Expense API
export const expenseApi = {
  getAll: () => api.get('/expenses'),
  getById: (id) => api.get(`/expenses/${id}`),
  getByProtocolNumber: (protocolNumber) => api.get(`/expenses/protocol/${protocolNumber}`),
  getByStatus: (status) => api.get(`/expenses/status/${status}`),
  create: (expense) => api.post('/expenses', expense),
  update: (id, expense) => api.put(`/expenses/${id}`, expense),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Commitment API
export const commitmentApi = {
  getAll: () => api.get('/commitments'),
  getById: (id) => api.get(`/commitments/${id}`),
  getByCommitmentNumber: (commitmentNumber) => api.get(`/commitments/number/${commitmentNumber}`),
  getByExpenseId: (expenseId) => api.get(`/commitments/expense/${expenseId}`),
  create: (commitment) => api.post('/commitments', commitment),
  update: (id, commitment) => api.put(`/commitments/${id}`, commitment),
  delete: (id) => api.delete(`/commitments/${id}`),
};

// Payment API
export const paymentApi = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getByPaymentNumber: (paymentNumber) => api.get(`/payments/number/${paymentNumber}`),
  getByCommitmentId: (commitmentId) => api.get(`/payments/commitment/${commitmentId}`),
  create: (payment) => api.post('/payments', payment),
  update: (id, payment) => api.put(`/payments/${id}`, payment),
  delete: (id) => api.delete(`/payments/${id}`),
};