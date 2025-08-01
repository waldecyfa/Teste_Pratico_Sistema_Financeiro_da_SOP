'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Card, Tabs, Tab, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaFileInvoiceDollar, FaMoneyBillWave } from 'react-icons/fa';
import Link from 'next/link';

import MainLayout from '../../../components/layout/MainLayout';
import ExpenseForm from '../../../components/expenses/ExpenseForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import StatusBadge from '../../../components/common/StatusBadge';
import CurrencyFormat from '../../../components/common/CurrencyFormat';
import DateFormat from '../../../components/common/DateFormat';

import { fetchExpenseById } from '../../../redux/slices/expenseSlice';
import { fetchCommitmentsByExpenseId } from '../../../redux/slices/commitmentSlice';

export default function ExpenseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('details');
  
  const { currentExpense, loading: expenseLoading } = useSelector((state) => state.expenses);
  const { commitments, loading: commitmentsLoading } = useSelector((state) => state.commitments);

  useEffect(() => {
    if (id) {
      dispatch(fetchExpenseById(id));
      dispatch(fetchCommitmentsByExpenseId(id));
    }
  }, [dispatch, id]);

  if (expenseLoading || !currentExpense) {
    return (
      <MainLayout>
        <div className="d-flex align-items-center mb-4">
          <Button variant="link" className="p-0 me-3" onClick={() => router.back()}>
            <FaArrowLeft />
          </Button>
          <h1 className="page-title mb-0">Expense Details</h1>
        </div>
        <LoadingSpinner text="Loading expense details..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" className="p-0 me-3" onClick={() => router.back()}>
          <FaArrowLeft />
        </Button>
        <h1 className="page-title mb-0">Expense Details</h1>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">{currentExpense.protocolNumber}</h5>
              <p className="text-muted mb-0">{currentExpense.creditor}</p>
            </div>
            <StatusBadge status={currentExpense.status} />
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3">
              <p className="mb-1 text-muted">Expense Type</p>
              <p className="mb-0 fw-medium">{currentExpense.expenseType}</p>
            </Col>
            <Col md={6} className="mb-3">
              <p className="mb-1 text-muted">Amount</p>
              <p className="mb-0 fw-medium">
                <CurrencyFormat value={currentExpense.amount} />
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <p className="mb-1 text-muted">Due Date</p>
              <p className="mb-0 fw-medium">
                <DateFormat date={currentExpense.dueDate} />
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <p className="mb-1 text-muted">Remaining Amount</p>
              <p className="mb-0 fw-medium">
                <CurrencyFormat value={currentExpense.remainingAmount} />
              </p>
            </Col>
            <Col xs={12} className="mb-3">
              <p className="mb-1 text-muted">Description</p>
              <p className="mb-0">{currentExpense.description}</p>
            </Col>
            {currentExpense.notes && (
              <Col xs={12}>
                <p className="mb-1 text-muted">Notes</p>
                <p className="mb-0">{currentExpense.notes}</p>
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
            <ExpenseForm expense={currentExpense} />
          </div>
        </Tab>
        <Tab eventKey="commitments" title="Commitments">
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 mb-0">Commitments</h3>
              {currentExpense.status !== 'PAID' && (
                <Link href={`/commitments/new?expenseId=${id}`} passHref legacyBehavior>
                  <Button variant="primary" size="sm">
                    <FaFileInvoiceDollar className="me-2" /> New Commitment
                  </Button>
                </Link>
              )}
            </div>

            {commitmentsLoading ? (
              <LoadingSpinner text="Loading commitments..." />
            ) : commitments && commitments.length > 0 ? (
              <div className="table-container">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Commitment Number</th>
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
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="mb-0">No commitments found for this expense.</p>
                {currentExpense.status !== 'PAID' && (
                  <p className="mt-2">
                    <Link href={`/commitments/new?expenseId=${id}`} passHref legacyBehavior>
                      <Button variant="primary" size="sm">
                        <FaFileInvoiceDollar className="me-2" /> Create First Commitment
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