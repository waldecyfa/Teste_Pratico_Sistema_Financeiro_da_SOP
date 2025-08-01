'use client';

import { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFileInvoiceDollar, FaMoneyCheckAlt, FaCreditCard } from 'react-icons/fa';

const Navigation = () => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar bg="primary" variant="dark" expand="lg" expanded={expanded} sticky="top">
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand>SOP Financial Control</Navbar.Brand>
        </Link>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : true)} 
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link active={pathname === '/'} onClick={closeNavbar}>Home</Nav.Link>
            </Link>
            
            {/* Expenses */}
            <NavDropdown 
              title={<span><FaFileInvoiceDollar className="me-1" />Expenses</span>} 
              id="expenses-dropdown"
              active={pathname.startsWith('/expenses')}
            >
              <Link href="/expenses" passHref legacyBehavior>
                <NavDropdown.Item onClick={closeNavbar}>All Expenses</NavDropdown.Item>
              </Link>
              <Link href="/expenses/new" passHref legacyBehavior>
                <NavDropdown.Item onClick={closeNavbar}>New Expense</NavDropdown.Item>
              </Link>
              <NavDropdown.Divider />
              <Link href="/expenses/search" passHref legacyBehavior>
                <NavDropdown.Item onClick={closeNavbar}>Search Expenses</NavDropdown.Item>
              </Link>
            </NavDropdown>
            
            {/* Commitments */}
            <NavDropdown 
              title={<span><FaMoneyCheckAlt className="me-1" />Commitments</span>} 
              id="commitments-dropdown"
              active={pathname.startsWith('/commitments')}
            >
              <Link href="/commitments" passHref legacyBehavior>
                <NavDropdown.Item onClick={closeNavbar}>All Commitments</NavDropdown.Item>
              </Link>
              <Link href="/commitments/new" passHref legacyBehavior>
                <NavDropdown.Item onClick={closeNavbar}>New Commitment</NavDropdown.Item>
              </Link>
              <NavDropdown.Divider />
              <Link href="/commitments/search" passHref legacyBehavior>
                <NavDropdown.Item onClick={closeNavbar}>Search Commitments</NavDropdown.Item>
              </Link>
            </NavDropdown>
            
            {/* Payments */}
            <NavDropdown 
              title={<span><FaCreditCard className="me-1" />Payments</span>} 
              id="payments-dropdown"
              active={pathname.startsWith('/payments')}
            >
              <Link href="/payments" passHref legacyBehavior>
                <NavDropdown.Item onClick={closeNavbar}>All Payments</NavDropdown.Item>
              </Link>
              <Link href="/payments/new" passHref legacyBehavior>
                <NavDropdown.Item onClick={closeNavbar}>New Payment</NavDropdown.Item>
              </Link>
              <NavDropdown.Divider />
              <Link href="/payments/search" passHref legacyBehavior>
                <NavDropdown.Item onClick={closeNavbar}>Search Payments</NavDropdown.Item>
              </Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;