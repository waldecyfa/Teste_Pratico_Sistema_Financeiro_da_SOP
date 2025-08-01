'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaFileInvoiceDollar, FaMoneyCheckAlt, FaCreditCard, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';
import { fetchExpenses } from '../redux/slices/expenseSlice';
import { fetchCommitments } from '../redux/slices/commitmentSlice';
import { fetchPayments } from '../redux/slices/paymentSlice';

export default function Home() {
  const dispatch = useDispatch();
  const { expenses } = useSelector((state) => state.expenses);
  const { commitments } = useSelector((state) => state.commitments);
  const { payments } = useSelector((state) => state.payments);
  
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalCommitments: 0,
    totalPayments: 0,
    pendingExpenses: 0,
    pendingCommitments: 0,
  });

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchCommitments());
    dispatch(fetchPayments());
  }, [dispatch]);

  useEffect(() => {
    if (expenses.length > 0) {
      const totalExpenseAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const pendingExpenses = expenses.filter(expense => 
        expense.status !== 'PAID'
      ).length;
      
      const totalCommitmentAmount = commitments.reduce((sum, commitment) => sum + commitment.amount, 0);
      const pendingCommitments = commitments.filter(commitment => {
        const totalPaid = commitment.totalPaidAmount || 0;
        return totalPaid < commitment.amount;
      }).length;
      
      const totalPaymentAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
      
      setSummary({
        totalExpenses: totalExpenseAmount,
        totalCommitments: totalCommitmentAmount,
        totalPayments: totalPaymentAmount,
        pendingExpenses,
        pendingCommitments,
      });
    }
  }, [expenses, commitments, payments]);

  return (
    <MainLayout>
      <h1 className="page-title">Financial Control Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaFileInvoiceDollar size={40} className="mb-3 text-primary" />
              <Card.Title>Expenses</Card.Title>
              <Card.Text className="fs-4">{expenses.length}</Card.Text>
              <Card.Text className="text-muted">Pending: {summary.pendingExpenses}</Card.Text>
              <Link href="/expenses" passHref legacyBehavior>
                <Button variant="outline-primary">View All</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaMoneyCheckAlt size={40} className="mb-3 text-success" />
              <Card.Title>Commitments</Card.Title>
              <Card.Text className="fs-4">{commitments.length}</Card.Text>
              <Card.Text className="text-muted">Pending: {summary.pendingCommitments}</Card.Text>
              <Link href="/commitments" passHref legacyBehavior>
                <Button variant="outline-success">View All</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaCreditCard size={40} className="mb-3 text-info" />
              <Card.Title>Payments</Card.Title>
              <Card.Text className="fs-4">{payments.length}</Card.Text>
              <Card.Text className="text-muted">&nbsp;</Card.Text>
              <Link href="/payments" passHref legacyBehavior>
                <Button variant="outline-info">View All</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaChartLine size={40} className="mb-3 text-warning" />
              <Card.Title>Financial Summary</Card.Title>
              <Card.Text className="fs-4">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                  .format(summary.totalPayments)}
              </Card.Text>
              <Card.Text className="text-muted">Total Paid</Card.Text>
              <Button variant="outline-warning" disabled>View Report</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">Recent Expenses</Card.Header>
            <Card.Body>
              {expenses.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {expenses.slice(0, 5).map((expense) => (
                    <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{expense.protocolNumber}</div>
                        <div className="text-muted small">{expense.creditor}</div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <span>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                            .format(expense.amount)}
                        </span>
                        <span className={`badge status-${expense.status.toLowerCase().replace('_', '-')}`}>
                          {expense.status.replace('_', ' ')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center">No expenses found</p>
              )}
            </Card.Body>
            <Card.Footer className="text-center">
              <Link href="/expenses" passHref legacyBehavior>
                <Button variant="primary" size="sm">View All Expenses</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">Recent Commitments</Card.Header>
            <Card.Body>
              {commitments.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {commitments.slice(0, 5).map((commitment) => (
                    <li key={commitment.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{commitment.commitmentNumber}</div>
                        <div className="text-muted small">
                          Protocol: {commitment.expenseProtocolNumber}
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <span>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                            .format(commitment.amount)}
                        </span>
                        <span className="text-muted small">
                          Paid: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                            .format(commitment.totalPaidAmount || 0)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center">No commitments found</p>
              )}
            </Card.Body>
            <Card.Footer className="text-center">
              <Link href="/commitments" passHref legacyBehavior>
                <Button variant="success" size="sm">View All Commitments</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
}