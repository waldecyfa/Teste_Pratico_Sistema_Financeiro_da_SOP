'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '../../components/layout/MainLayout';
import StatusBadge from '../../components/common/StatusBadge';
import CurrencyFormat from '../../components/common/CurrencyFormat';
import DateFormat from '../../components/common/DateFormat';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { fetchExpenses, deleteExpense } from '../../redux/slices/expenseSlice';

export default function ExpensesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  useEffect(() => {
    if (expenses) {
      setFilteredExpenses(
        expenses.filter((expense) =>
          expense.protocolNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.creditor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [expenses, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await dispatch(deleteExpense(id));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading && expenses.length === 0) {
    return (
      <MainLayout>
        <h1 className="page-title">Expenses</h1>
        <LoadingSpinner text="Loading expenses..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Expenses</h1>
        <Link href="/expenses/new" passHref legacyBehavior>
          <Button variant="primary">
            <FaPlus className="me-2" /> New Expense
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by protocol number, creditor, or description..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <div className="table-container">
        {filteredExpenses.length > 0 ? (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Protocol Number</th>
                <th>Type</th>
                <th>Creditor</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.protocolNumber}</td>
                  <td>{expense.expenseType}</td>
                  <td>{expense.creditor}</td>
                  <td>
                    <DateFormat date={expense.dueDate} />
                  </td>
                  <td>
                    <CurrencyFormat value={expense.amount} />
                  </td>
                  <td>
                    <StatusBadge status={expense.status} />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/expenses/${expense.id}`} passHref legacyBehavior>
                        <Button variant="outline-primary" size="sm">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        disabled={expense.status !== 'AWAITING_COMMITMENT'}
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
                ? 'No expenses found matching your search criteria.'
                : 'No expenses found. Create your first expense!'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}