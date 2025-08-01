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
import { fetchPayments, deletePayment } from '../../redux/slices/paymentSlice';

export default function PaymentsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { payments, loading } = useSelector((state) => state.payments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  useEffect(() => {
    if (payments) {
      setFilteredPayments(
        payments.filter((payment) =>
          payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (payment.commitmentNumber && 
            payment.commitmentNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (payment.expenseProtocolNumber && 
            payment.expenseProtocolNumber.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [payments, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      await dispatch(deletePayment(id));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading && payments.length === 0) {
    return (
      <MainLayout>
        <h1 className="page-title">Payments</h1>
        <LoadingSpinner text="Loading payments..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Payments</h1>
        <Link href="/payments/new" passHref legacyBehavior>
          <Button variant="primary">
            <FaPlus className="me-2" /> New Payment
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by payment number, commitment number, or expense protocol..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <div className="table-container">
        {filteredPayments.length > 0 ? (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Payment Number</th>
                <th>Commitment</th>
                <th>Expense</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.paymentNumber}</td>
                  <td>
                    <Link href={`/commitments/${payment.commitmentId}`} className="text-decoration-none">
                      {payment.commitmentNumber}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/expenses/${payment.expenseId}`} className="text-decoration-none">
                      {payment.expenseProtocolNumber}
                    </Link>
                  </td>
                  <td>
                    <DateFormat date={payment.date} />
                  </td>
                  <td>
                    <CurrencyFormat value={payment.amount} />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/payments/${payment.id}`} passHref legacyBehavior>
                        <Button variant="outline-primary" size="sm">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(payment.id)}
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
                ? 'No payments found matching your search criteria.'
                : 'No payments found. Create your first payment!'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}