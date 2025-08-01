-- Database schema for SOP Financial Control System

-- Create database (run this separately if needed)
-- CREATE DATABASE sop_financial_control;

-- Create enum type for expense types
CREATE TYPE expense_type AS ENUM ('Building Work', 'Highway Work', 'Other');

-- Create enum type for expense status
CREATE TYPE expense_status AS ENUM (
    'Awaiting Commitment',
    'Partially Committed',
    'Awaiting Payment',
    'Partially Paid',
    'Paid'
);

-- Create Expense table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    protocol_number VARCHAR(20) UNIQUE NOT NULL,
    expense_type expense_type NOT NULL,
    protocol_date TIMESTAMP NOT NULL,
    due_date DATE NOT NULL,
    creditor VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status expense_status,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_amount_positive CHECK (amount > 0)
);

-- Create Commitment table
CREATE TABLE commitments (
    id SERIAL PRIMARY KEY,
    commitment_number VARCHAR(20) UNIQUE NOT NULL,
    commitment_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    note TEXT,
    expense_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense FOREIGN KEY (expense_id) REFERENCES expenses(id),
    CONSTRAINT check_amount_positive CHECK (amount > 0)
);

-- Create Payment table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_number VARCHAR(20) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    note TEXT,
    commitment_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commitment FOREIGN KEY (commitment_id) REFERENCES commitments(id),
    CONSTRAINT check_amount_positive CHECK (amount > 0)
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update timestamp on update
CREATE TRIGGER update_expense_modtime
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_commitment_modtime
    BEFORE UPDATE ON commitments
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_payment_modtime
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create indexes for better performance
CREATE INDEX idx_expense_protocol_number ON expenses(protocol_number);
CREATE INDEX idx_commitment_number ON commitments(commitment_number);
CREATE INDEX idx_payment_number ON payments(payment_number);
CREATE INDEX idx_commitment_expense_id ON commitments(expense_id);
CREATE INDEX idx_payment_commitment_id ON payments(commitment_id);