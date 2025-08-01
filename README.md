# SOP Financial Control System

This project is a financial control system for SOP (Superintendência de Obras Públicas) that manages three main business entities: Expenses, Commitments, and Payments.

## Project Structure

The project is divided into two main components:

- `frontend`: Next.js application with Redux for state management
- `backend`: SpringBoot application with JPA for database access

## Business Entities

### Expense
- Protocol number (unique)
- Expense type
- Protocol date
- Due date
- Expense creditor
- Expense description
- Expense amount
- Status (optional)

### Commitment
- Commitment number (unique)
- Commitment date
- Commitment amount
- Note
- Associated with one Expense

### Payment
- Payment number (unique)
- Payment date
- Payment amount
- Note
- Associated with one Commitment

## Business Rules

- The sum of commitment amounts for an expense must not exceed the expense's value
- The sum of payment amounts for a commitment must not exceed the commitment's value
- Deletion of a commitment with associated payments is not permitted
- Deletion of an expense with associated commitments is not permitted

## Technical Stack

### Frontend
- Next.js
- Redux
- Axios

### Backend
- SpringBoot
- JPA
- DTOs

### Database
- PostgreSQL

## Setup Instructions

See the README files in the frontend and backend directories for specific setup instructions.