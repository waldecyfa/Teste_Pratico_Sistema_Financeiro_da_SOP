'use client';

import MainLayout from '../../../components/layout/MainLayout';
import CommitmentForm from '../../../components/commitments/CommitmentForm';

export default function NewCommitmentPage() {
  return (
    <MainLayout>
      <h1 className="page-title mb-4">Create New Commitment</h1>
      <CommitmentForm />
    </MainLayout>
  );
}