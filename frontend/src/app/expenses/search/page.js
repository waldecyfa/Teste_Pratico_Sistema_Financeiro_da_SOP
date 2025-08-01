'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Card, Row, Col, Table } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';

import MainLayout from '../../../components/layout/MainLayout';
import StatusBadge from '../../../components/common/StatusBadge';
import CurrencyFormat from '../../../components/common/CurrencyFormat';
import DateFormat from '../../../components/common/DateFormat';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

import { fetchExpenseByProtocolNumber, fetchExpensesByStatus } from '../../../redux/slices/expenseSlice';

export default function SearchExpensesPage() {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  
  const [searchType, setSearchType] = useState('protocolNumber');
  const [protocolNumber, setProtocolNumber] = useState('');
  const [status, setStatus] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    
    if (searchType === 'protocolNumber' && protocolNumber) {
      await dispatch(fetchExpenseByProtocolNumber(protocolNumber));
    } else if (searchType === 'status' && status) {
      await dispatch(fetchExpensesByStatus(status));
    }
  };

  return (
    <MainLayout>
      <h1 className="page-title mb-4">Search Expenses</h1>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={3}>
                <Form.Group className="mb-3" controlId="searchType">
                  <Form.Label>Search By</Form.Label>
                  <Form.Select 
                    value={searchType} 
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="protocolNumber">Protocol Number</option>
                    <option value="status">Status</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              {searchType === 'protocolNumber' ? (
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="protocolNumber">
                    <Form.Label>Protocol Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter protocol number" 
                      value={protocolNumber}
                      onChange={(e) => setProtocolNumber(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              ) : (
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="">Select a status</option>
                      <option value="AWAITING_COMMITMENT">Awaiting Commitment</option>
                      <option value="PARTIALLY_COMMITTED">Partially Committed</option>
                      <option value="AWAITING_PAYMENT">Awaiting Payment</option>
                      <option value="PARTIALLY_PAID">Partially Paid</option>
                      <option value="PAID">Paid</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
              
              <Col md={3}>
                <Button type="submit" variant="primary" className="w-100 mb-3">
                  <FaSearch className="me-2" /> Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {loading ? (
        <LoadingSpinner text="Searching expenses..." />
      ) : hasSearched ? (
        <div className="table-container">
          {expenses && expenses.length > 0 ? (
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
                {expenses.map((expense) => (
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
                      <Link href={`/expenses/${expense.id}`} passHref legacyBehavior>
                        <Button variant="outline-primary" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="mb-0">No expenses found matching your search criteria.</p>
            </div>
          )}
        </div>
      ) : null}
    </MainLayout>
  );
}