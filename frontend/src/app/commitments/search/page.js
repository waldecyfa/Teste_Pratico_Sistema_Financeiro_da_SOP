'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Card, Row, Col, Table } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';

import MainLayout from '../../../components/layout/MainLayout';
import CurrencyFormat from '../../../components/common/CurrencyFormat';
import DateFormat from '../../../components/common/DateFormat';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

import { fetchCommitmentByNumber, fetchCommitmentsByExpenseId } from '../../../redux/slices/commitmentSlice';
import { fetchExpenseByProtocolNumber } from '../../../redux/slices/expenseSlice';

export default function SearchCommitmentsPage() {
  const dispatch = useDispatch();
  const { commitments, loading } = useSelector((state) => state.commitments);
  const { currentExpense } = useSelector((state) => state.expenses);
  
  const [searchType, setSearchType] = useState('commitmentNumber');
  const [commitmentNumber, setCommitmentNumber] = useState('');
  const [expenseProtocol, setExpenseProtocol] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchingExpense, setSearchingExpense] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    
    if (searchType === 'commitmentNumber' && commitmentNumber) {
      await dispatch(fetchCommitmentByNumber(commitmentNumber));
    } else if (searchType === 'expenseProtocol' && expenseProtocol) {
      setSearchingExpense(true);
      const resultAction = await dispatch(fetchExpenseByProtocolNumber(expenseProtocol));
      if (fetchExpenseByProtocolNumber.fulfilled.match(resultAction) && resultAction.payload) {
        const expense = Array.isArray(resultAction.payload) 
          ? resultAction.payload[0] 
          : resultAction.payload;
          
        if (expense && expense.id) {
          await dispatch(fetchCommitmentsByExpenseId(expense.id));
        }
      }
      setSearchingExpense(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="page-title mb-4">Search Commitments</h1>
      
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
                    <option value="commitmentNumber">Commitment Number</option>
                    <option value="expenseProtocol">Expense Protocol</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              {searchType === 'commitmentNumber' ? (
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="commitmentNumber">
                    <Form.Label>Commitment Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter commitment number" 
                      value={commitmentNumber}
                      onChange={(e) => setCommitmentNumber(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              ) : (
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="expenseProtocol">
                    <Form.Label>Expense Protocol Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter expense protocol number" 
                      value={expenseProtocol}
                      onChange={(e) => setExpenseProtocol(e.target.value)}
                      required
                    />
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
      
      {loading || searchingExpense ? (
        <LoadingSpinner text="Searching commitments..." />
      ) : hasSearched ? (
        <div>
          {searchType === 'expenseProtocol' && currentExpense && (
            <div className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <h5>Expense Details</h5>
                  <Row>
                    <Col md={4}>
                      <p className="mb-1"><strong>Protocol:</strong> {currentExpense.protocolNumber}</p>
                      <p className="mb-1"><strong>Creditor:</strong> {currentExpense.creditor}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-1"><strong>Amount:</strong> <CurrencyFormat value={currentExpense.amount} /></p>
                      <p className="mb-1"><strong>Due Date:</strong> <DateFormat date={currentExpense.dueDate} /></p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-1"><strong>Status:</strong> {currentExpense.status}</p>
                      <p className="mb-1">
                        <Link href={`/expenses/${currentExpense.id}`} passHref legacyBehavior>
                          <Button variant="outline-primary" size="sm">
                            View Expense Details
                          </Button>
                        </Link>
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
          
          <div className="table-container">
            {commitments && commitments.length > 0 ? (
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
                  {commitments.map((commitment) => (
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
                        <Link href={`/commitments/${commitment.id}`} passHref legacyBehavior>
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
                <p className="mb-0">No commitments found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </MainLayout>
  );
}