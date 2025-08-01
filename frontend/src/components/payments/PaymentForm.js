'use client';

import { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { createPayment, updatePayment } from '../../redux/slices/paymentSlice';
import { fetchCommitments, fetchCommitmentById } from '../../redux/slices/commitmentSlice';
import CurrencyFormat from '../common/CurrencyFormat';

const PaymentForm = ({ payment = null }) => {
  const isEditing = !!payment;
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const commitmentIdFromUrl = searchParams.get('commitmentId');
  const { commitments, currentCommitment } = useSelector((state) => state.commitments);
  
  const [formData, setFormData] = useState({
    paymentNumber: '',
    commitmentId: commitmentIdFromUrl || '',
    date: '',
    amount: '',
    notes: ''
  });

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCommitment, setSelectedCommitment] = useState(null);

  useEffect(() => {
    dispatch(fetchCommitments());
    
    if (commitmentIdFromUrl) {
      dispatch(fetchCommitmentById(commitmentIdFromUrl));
    }
  }, [dispatch, commitmentIdFromUrl]);

  useEffect(() => {
    if (isEditing && payment) {
      // Format date for input field (YYYY-MM-DD)
      const formattedDate = payment.date 
        ? new Date(payment.date).toISOString().split('T')[0]
        : '';

      setFormData({
        paymentNumber: payment.paymentNumber || '',
        commitmentId: payment.commitmentId || '',
        date: formattedDate,
        amount: payment.amount || '',
        notes: payment.notes || ''
      });
      
      if (payment.commitmentId) {
        dispatch(fetchCommitmentById(payment.commitmentId));
      }
    }
  }, [isEditing, payment, dispatch]);

  useEffect(() => {
    if (currentCommitment && (currentCommitment.id === formData.commitmentId || currentCommitment.id === commitmentIdFromUrl)) {
      setSelectedCommitment(currentCommitment);
    }
  }, [currentCommitment, formData.commitmentId, commitmentIdFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'commitmentId' && value) {
      dispatch(fetchCommitmentById(value));
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert amount to number
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (isEditing) {
        await dispatch(updatePayment({ id: payment.id, paymentData })).unwrap();
      } else {
        await dispatch(createPayment(paymentData)).unwrap();
      }
      
      router.push('/payments');
    } catch (error) {
      console.error('Failed to save payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMaxAmount = () => {
    if (!selectedCommitment) return 0;
    
    if (isEditing) {
      // When editing, the max is the commitment's remaining amount + this payment's amount
      return selectedCommitment.remainingAmount + payment.amount;
    } else {
      // When creating, the max is just the commitment's remaining amount
      return selectedCommitment.remainingAmount;
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="paymentNumber">
                <Form.Label>Payment Number*</Form.Label>
                <Form.Control
                  type="text"
                  name="paymentNumber"
                  value={formData.paymentNumber}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                  placeholder="e.g., 2023NP12345"
                />
                <Form.Control.Feedback type="invalid">
                  Payment number is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="date">
                <Form.Label>Date*</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Date is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="commitmentId">
                <Form.Label>Associated Commitment*</Form.Label>
                <Form.Select
                  name="commitmentId"
                  value={formData.commitmentId}
                  onChange={handleChange}
                  required
                  disabled={isEditing || !!commitmentIdFromUrl}
                >
                  <option value="">Select a commitment</option>
                  {commitments
                    .filter(commitment => 
                      commitment.remainingAmount > 0 || commitment.id === formData.commitmentId
                    )
                    .map(commitment => (
                      <option key={commitment.id} value={commitment.id}>
                        {commitment.commitmentNumber} - Expense: {commitment.expenseProtocolNumber} 
                        ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(commitment.remainingAmount)})
                      </option>
                    ))
                  }
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Associated commitment is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {selectedCommitment && (
            <div className="mb-3 p-3 bg-light rounded">
              <h6>Commitment Details</h6>
              <Row>
                <Col md={6}>
                  <p className="mb-1"><small>Number: {selectedCommitment.commitmentNumber}</small></p>
                  <p className="mb-1"><small>Expense: {selectedCommitment.expenseProtocolNumber}</small></p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><small>Total Amount: <CurrencyFormat value={selectedCommitment.amount} /></small></p>
                  <p className="mb-1"><small>Available: <CurrencyFormat value={getMaxAmount()} /></small></p>
                </Col>
              </Row>
            </div>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="amount">
                <Form.Label>Amount (R$)*</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0.01"
                  max={selectedCommitment ? getMaxAmount() : undefined}
                  step="0.01"
                  placeholder="0.00"
                />
                <Form.Control.Feedback type="invalid">
                  Valid amount is required (max: <CurrencyFormat value={getMaxAmount()} />).
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="notes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes (optional)"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              variant="outline-secondary"
              onClick={() => router.push('/payments')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || !selectedCommitment}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Payment' : 'Create Payment'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PaymentForm;