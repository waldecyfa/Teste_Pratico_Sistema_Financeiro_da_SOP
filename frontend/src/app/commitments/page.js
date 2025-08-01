'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '../../components/layout/MainLayout';
import CurrencyFormat from '../../components/common/CurrencyFormat';
import DateFormat from '../../components/common/DateFormat';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { fetchCommitments, deleteCommitment } from '../../redux/slices/commitmentSlice';

export default function CommitmentsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { commitments, loading } = useSelector((state) => state.commitments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommitments, setFilteredCommitments] = useState([]);

  useEffect(() => {
    dispatch(fetchCommitments());
  }, [dispatch]);

  useEffect(() => {
    if (commitments) {
      setFilteredCommitments(
        commitments.filter((commitment) =>
          commitment.commitmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (commitment.expenseProtocolNumber && 
            commitment.expenseProtocolNumber.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [commitments, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this commitment?')) {
      await dispatch(deleteCommitment(id));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading && commitments.length === 0) {
    return (
      <MainLayout>
        <h1 className="page-title">Commitments</h1>
        <LoadingSpinner text="Loading commitments..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Commitments</h1>
        <Link href="/commitments/new" passHref legacyBehavior>
          <Button variant="primary">
            <FaPlus className="me-2" /> New Commitment
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by commitment number or expense protocol..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <div className="table-container">
        {filteredCommitments.length > 0 ? (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Commitment Number</th>
                <th>Expense Protocol</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Remaining</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommitments.map((commitment) => (
                <tr key={commitment.id}>
                  <td>{commitment.commitmentNumber}</td>
                  <td>
                    <Link href={`/expenses/${commitment.expenseId}`} className="text-decoration-none">
                      {commitment.expenseProtocolNumber}
                    </Link>
                  </td>
                  <td>
                    <DateFormat date={commitment.date} />
                  </td>
                  <td>
                    <CurrencyFormat value={commitment.amount} />
                  </td>
                  <td>
                    <CurrencyFormat value={commitment.remainingAmount} />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/commitments/${commitment.id}`} passHref legacyBehavior>
                        <Button variant="outline-primary" size="sm">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(commitment.id)}
                        disabled={commitment.totalPaidAmount > 0}
                      >
                        <FaTrashAlt />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <p className="mb-0">
              {searchTerm
                ? 'No commitments found matching your search criteria.'
                : 'No commitments found. Create your first commitment!'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}