'use client';

import { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createExpense, updateExpense } from '../../redux/slices/expenseSlice';

const ExpenseForm = ({ expense = null }) => {
  const isEditing = !!expense;
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    protocolNumber: '',
    expenseType: '',
    creditor: '',
    description: '',
    amount: '',
    dueDate: '',
    notes: ''
  });

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && expense) {
      // Format date for input field (YYYY-MM-DD)
      const formattedDate = expense.dueDate 
        ? new Date(expense.dueDate).toISOString().split('T')[0]
        : '';

      setFormData({
        protocolNumber: expense.protocolNumber || '',
        expenseType: expense.expenseType || '',
        creditor: expense.creditor || '',
        description: expense.description || '',
        amount: expense.amount || '',
        dueDate: formattedDate,
        notes: expense.notes || ''
      });
    }
  }, [isEditing, expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (isEditing) {
        await dispatch(updateExpense({ id: expense.id, expenseData })).unwrap();
      } else {
        await dispatch(createExpense(expenseData)).unwrap();
      }
      
      router.push('/expenses');
    } catch (error) {
      console.error('Failed to save expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="protocolNumber">
                <Form.Label>Protocol Number*</Form.Label>
                <Form.Control
                  type="text"
                  name="protocolNumber"
                  value={formData.protocolNumber}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                  placeholder="e.g., 2023PR12345"
                />
                <Form.Control.Feedback type="invalid">
                  Protocol number is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="expenseType">
                <Form.Label>Expense Type*</Form.Label>
                <Form.Select
                  name="expenseType"
                  value={formData.expenseType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select expense type</option>
                  <option value="SERVICES">Services</option>
                  <option value="MATERIALS">Materials</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="TRAVEL">Travel</option>
                  <option value="OTHER">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Expense type is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="creditor">
                <Form.Label>Creditor*</Form.Label>
                <Form.Control
                  type="text"
                  name="creditor"
                  value={formData.creditor}
                  onChange={handleChange}
                  required
                  placeholder="Creditor name"
                />
                <Form.Control.Feedback type="invalid">
                  Creditor is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
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
                  step="0.01"
                  placeholder="0.00"
                />
                <Form.Control.Feedback type="invalid">
                  Valid amount is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="dueDate">
                <Form.Label>Due Date*</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Due date is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description*</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Brief description of the expense"
            />
            <Form.Control.Feedback type="invalid">
              Description is required.
            </Form.Control.Feedback>
          </Form.Group>

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
              onClick={() => router.push('/expenses')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Expense' : 'Create Expense'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ExpenseForm;