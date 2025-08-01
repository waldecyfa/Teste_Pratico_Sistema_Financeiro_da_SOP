'use client';

import { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { createCommitment, updateCommitment } from '../../redux/slices/commitmentSlice';
import { fetchExpenses, fetchExpenseById } from '../../redux/slices/expenseSlice';
import CurrencyFormat from '../common/CurrencyFormat';

const CommitmentForm = ({ commitment = null }) => {
  const isEditing = !!commitment;
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const expenseIdFromUrl = searchParams.get('expenseId');
  const { expenses, currentExpense } = useSelector((state) => state.expenses);
  
  const [formData, setFormData] = useState({
    commitmentNumber: '',
    expenseId: expenseIdFromUrl || '',
    date: '',
    amount: '',
    notes: ''
  });

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    dispatch(fetchExpenses());
    
    if (expenseIdFromUrl) {
      dispatch(fetchExpenseById(expenseIdFromUrl));
    }
  }, [dispatch, expenseIdFromUrl]);

  useEffect(() => {
    if (isEditing && commitment) {
      // Format date for input field (YYYY-MM-DD)
      const formattedDate = commitment.date 
        ? new Date(commitment.date).toISOString().split('T')[0]
        : '';

      setFormData({
        commitmentNumber: commitment.commitmentNumber || '',
        expenseId: commitment.expenseId || '',
        date: formattedDate,
        amount: commitment.amount || '',
        notes: commitment.notes || ''
      });
      
      if (commitment.expenseId) {
        dispatch(fetchExpenseById(commitment.expenseId));
      }
    }
  }, [isEditing, commitment, dispatch]);

  useEffect(() => {
    if (currentExpense && (currentExpense.id === formData.expenseId || currentExpense.id === expenseIdFromUrl)) {
      setSelectedExpense(currentExpense);
    }
  }, [currentExpense, formData.expenseId, expenseIdFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'expenseId' && value) {
      dispatch(fetchExpenseById(value));
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
      const commitmentData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (isEditing) {
        await dispatch(updateCommitment({ id: commitment.id, commitmentData })).unwrap();
      } else {
        await dispatch(createCommitment(commitmentData)).unwrap();
      }
      
      router.push('/commitments');
    } catch (error) {
      console.error('Failed to save commitment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMaxAmount = () => {
    if (!selectedExpense) return 0;
    
    if (isEditing) {
      // When editing, the max is the expense's remaining amount + this commitment's amount
      return selectedExpense.remainingAmount + commitment.amount;
    } else {
      // When creating, the max is just the expense's remaining amount
      return selectedExpense.remainingAmount;
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="commitmentNumber">
                <Form.Label>Commitment Number*</Form.Label>
                <Form.Control
                  type="text"
                  name="commitmentNumber"
                  value={formData.commitmentNumber}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                  placeholder="e.g., 2023NE12345"
                />
                <Form.Control.Feedback type="invalid">
                  Commitment number is required.
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
              <Form.Group className="mb-3" controlId="expenseId">
                <Form.Label>Associated Expense*</Form.Label>
                <Form.Select
                  name="expenseId"
                  value={formData.expenseId}
                  onChange={handleChange}
                  required
                  disabled={isEditing || !!expenseIdFromUrl}
                >
                  <option value="">Select an expense</option>
                  {expenses
                    .filter(expense => 
                      expense.status !== 'PAID' && 
                      (expense.remainingAmount > 0 || expense.id === formData.expenseId)
                    )
                    .map(expense => (
                      <option key={expense.id} value={expense.id}>
                        {expense.protocolNumber} - {expense.creditor} 
                        ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.remainingAmount)})
                      </option>
                    ))
                  }
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Associated expense is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {selectedExpense && (
            <div className="mb-3 p-3 bg-light rounded">
              <h6>Expense Details</h6>
              <Row>
                <Col md={6}>
                  <p className="mb-1"><small>Protocol: {selectedExpense.protocolNumber}</small></p>
                  <p className="mb-1"><small>Creditor: {selectedExpense.creditor}</small></p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><small>Total Amount: <CurrencyFormat value={selectedExpense.amount} /></small></p>
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
                  max={selectedExpense ? getMaxAmount() : undefined}
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
              onClick={() => router.push('/commitments')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || !selectedExpense}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Commitment' : 'Create Commitment'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CommitmentForm;