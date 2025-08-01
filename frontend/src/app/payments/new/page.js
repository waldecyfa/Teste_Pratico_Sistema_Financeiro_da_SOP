'use client';

import MainLayout from '../../../components/layout/MainLayout';
import PaymentForm from '../../../components/payments/PaymentForm';

export default function NewPaymentPage() {
  return (
    <MainLayout>
      <h1 className="page-title mb-4">Create New Payment</h1>
      <PaymentForm />
    </MainLayout>
  );
}