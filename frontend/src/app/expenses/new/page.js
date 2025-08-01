'use client';

import MainLayout from '../../../components/layout/MainLayout';
import ExpenseForm from '../../../components/expenses/ExpenseForm';

export default function NewExpensePage() {
  return (
    <MainLayout>
      <h1 className="page-title mb-4">Create New Expense</h1>
      <ExpenseForm />
    </MainLayout>
  );
}