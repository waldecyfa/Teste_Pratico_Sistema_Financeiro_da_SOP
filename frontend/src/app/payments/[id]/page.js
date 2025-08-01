'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

import MainLayout from '../../../components/layout/MainLayout';
import PaymentForm from '../../../components/payments/PaymentForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import CurrencyFormat from '../../../components/common/CurrencyFormat';
import DateFormat from '../../../components/common/DateFormat';

import { fetchPaymentById } from '../../../redux/slices/paymentSlice';

export default function PaymentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { currentPayment, loading } = useSelector((state) => state.payments);

  useEffect(() => {
    if (id) {
      dispatch(fetchPaymentById(id));
    }
  }, [dispatch, id]);

  if (loading || !currentPayment) {
    return (
      <MainLayout>
        <div className="d-flex align-items-center mb-4">
          <Button variant="link" className="p-0 me-3" onClick={() => router.back()}>
            <FaArrowLeft />
          </Button>
          <h1 className="page-title mb-0">Payment Details</h1>
        </div>
        <LoadingSpinner text="Loading payment details..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" className="p-0 me-3" onClick={() => router.back()}>
          <FaArrowLeft />
        </Button>
        <h1 className="page-title mb-0">Payment Details</h1>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">{currentPayment.paymentNumber}</h5>
              <p className="text-muted mb-0">
                <Link href={`/commitments/${currentPayment.commitmentId}`} className="text-decoration-none">
                  Commitment: {currentPayment.commitmentNumber}
                </Link>
                {' | '}
                <Link href={`/expenses/${currentPayment.expenseId}`} className="text-decoration-none">
                  Expense: {currentPayment.expenseProtocolNumber}
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
                <DateFormat date={currentPayment.date} />
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <p className="mb-1 text-muted">Amount</p>
              <p className="mb-0 fw-medium">
                <CurrencyFormat value={currentPayment.amount} />
              </p>
            </Col>
            {currentPayment.notes && (
              <Col xs={12}>
                <p className="mb-1 text-muted">Notes</p>
                <p className="mb-0">{currentPayment.notes}</p>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      <div className="mt-4">
        <h3 className="h5 mb-3">Edit Payment</h3>
        <PaymentForm payment={currentPayment} />
      </div>
    </MainLayout>
  );
}