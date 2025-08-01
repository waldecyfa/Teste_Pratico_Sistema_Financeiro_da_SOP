'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Card, Tabs, Tab, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';
import Link from 'next/link';

import MainLayout from '../../../components/layout/MainLayout';
import CommitmentForm from '../../../components/commitments/CommitmentForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import CurrencyFormat from '../../../components/common/CurrencyFormat';
import DateFormat from '../../../components/common/DateFormat';

import { fetchCommitmentById } from '../../../redux/slices/commitmentSlice';
import { fetchPaymentsByCommitmentId } from '../../../redux/slices/paymentSlice';

export default function CommitmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('details');
  
  const { currentCommitment, loading: commitmentLoading } = useSelector((state) => state.commitments);
  const { payments, loading: paymentsLoading } = useSelector((state) => state.payments);

  useEffect(() => {
    if (id) {
      dispatch(fetchCommitmentById(id));
      dispatch(fetchPaymentsByCommitmentId(id));
    }
  }, [dispatch, id]);

  if (commitmentLoading || !currentCommitment) {
    return (
      <MainLayout>
        <div className="d-flex align-items-center mb-4">
          <Button variant="link" className="p-0 me-3" onClick={() => router.back()}>
            <FaArrowLeft />
          </Button>
          <h1 className="page-title mb-0">Commitment Details</h1>
        </div>
        <LoadingSpinner text="Loading commitment details..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" className="p-0 me-3" onClick={() => router.back()}>
          <FaArrowLeft />
        </Button>
        <h1 className="page-title mb-0">Commitment Details</h1>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">{currentCommitment.commitmentNumber}</h5>
              <p className="text-muted mb-0">
                <Link href={`/expenses/${currentCommitment.expenseId}`} className="text-decoration-none">
                  Expense: {currentCommitment.expenseProtocolNumber}
                </Link>
              </p>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3">
              <p className="mb-1 text-muted">Date</p>
              <p className="mb-0 fw-medium">
                <DateFormat date={currentCommitment.date} />
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <p className="mb-1 text-muted">Amount</p>
              <p className="mb-0 fw-medium">
                <CurrencyFormat value={currentCommitment.amount} />
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <p className="mb-1 text-muted">Paid Amount</p>
              <p className="mb-0 fw-medium">
                <CurrencyFormat value={currentCommitment.totalPaidAmount} />
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <p className="mb-1 text-muted">Remaining Amount</p>
              <p className="mb-0 fw-medium">
                <CurrencyFormat value={currentCommitment.remainingAmount} />
              </p>
            </Col>
            {currentCommitment.notes && (
              <Col xs={12}>
                <p className="mb-1 text-muted">Notes</p>
                <p className="mb-0">{currentCommitment.notes}</p>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="details" title="Edit Details">
          <div className="mt-4">
            <CommitmentForm commitment={currentCommitment} />
          </div>
        </Tab>
        <Tab eventKey="payments" title="Payments">
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 mb-0">Payments</h3>
              {currentCommitment.remainingAmount > 0 && (
                <Link href={`/payments/new?commitmentId=${id}`} passHref legacyBehavior>
                  <Button variant="primary" size="sm">
                    <FaMoneyBillWave className="me-2" /> New Payment
                  </Button>
                </Link>
              )}
            </div>

            {paymentsLoading ? (
              <LoadingSpinner text="Loading payments..." />
            ) : payments && payments.length > 0 ? (
              <div className="table-container">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Payment Number</th>
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
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="mb-0">No payments found for this commitment.</p>
                {currentCommitment.remainingAmount > 0 && (
                  <p className="mt-2">
                    <Link href={`/payments/new?commitmentId=${id}`} passHref legacyBehavior>
                      <Button variant="primary" size="sm">
                        <FaMoneyBillWave className="me-2" /> Create First Payment
                      </Button>
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </MainLayout>
  );
}