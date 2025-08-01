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

import { fetchPaymentByNumber, fetchPaymentsByCommitmentId } from '../../../redux/slices/paymentSlice';
import { fetchCommitmentByNumber, fetchCommitmentById } from '../../../redux/slices/commitmentSlice';

export default function SearchPaymentsPage() {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.payments);
  const { currentCommitment, loading: commitmentLoading } = useSelector((state) => state.commitments);
  
  const [searchType, setSearchType] = useState('paymentNumber');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [commitmentNumber, setCommitmentNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchingCommitment, setSearchingCommitment] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    
    if (searchType === 'paymentNumber' && paymentNumber) {
      await dispatch(fetchPaymentByNumber(paymentNumber));
    } else if (searchType === 'commitmentNumber' && commitmentNumber) {
      setSearchingCommitment(true);
      const resultAction = await dispatch(fetchCommitmentByNumber(commitmentNumber));
      if (fetchCommitmentByNumber.fulfilled.match(resultAction) && resultAction.payload) {
        const commitment = Array.isArray(resultAction.payload) 
          ? resultAction.payload[0] 
          : resultAction.payload;
          
        if (commitment && commitment.id) {
          await dispatch(fetchCommitmentById(commitment.id));
          await dispatch(fetchPaymentsByCommitmentId(commitment.id));
        }
      }
      setSearchingCommitment(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="page-title mb-4">Search Payments</h1>
      
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
                    <option value="paymentNumber">Payment Number</option>
                    <option value="commitmentNumber">Commitment Number</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              {searchType === 'paymentNumber' ? (
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="paymentNumber">
                    <Form.Label>Payment Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter payment number" 
                      value={paymentNumber}
                      onChange={(e) => setPaymentNumber(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              ) : (
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
      
      {loading || searchingCommitment || commitmentLoading ? (
        <LoadingSpinner text="Searching payments..." />
      ) : hasSearched ? (
        <div>
          {searchType === 'commitmentNumber' && currentCommitment && (
            <div className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <h5>Commitment Details</h5>
                  <Row>
                    <Col md={4}>
                      <p className="mb-1"><strong>Number:</strong> {currentCommitment.commitmentNumber}</p>
                      <p className="mb-1"><strong>Expense:</strong> {currentCommitment.expenseProtocolNumber}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-1"><strong>Amount:</strong> <CurrencyFormat value={currentCommitment.amount} /></p>
                      <p className="mb-1"><strong>Date:</strong> <DateFormat date={currentCommitment.date} /></p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-1"><strong>Remaining:</strong> <CurrencyFormat value={currentCommitment.remainingAmount} /></p>
                      <p className="mb-1">
                        <Link href={`/commitments/${currentCommitment.id}`} passHref legacyBehavior>
                          <Button variant="outline-primary" size="sm">
                            View Commitment Details
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
            {payments && payments.length > 0 ? (
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
                  {payments.map((payment) => (
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
                        <Link href={`/payments/${payment.id}`} passHref legacyBehavior>
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
                <p className="mb-0">No payments found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </MainLayout>
  );
}