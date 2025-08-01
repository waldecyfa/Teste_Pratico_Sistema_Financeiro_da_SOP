'use client';

import { Container } from 'react-bootstrap';
import Navigation from './Navigation';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navigation />
      <Container className="page-container">
        {children}
      </Container>
    </>
  );
};

export default MainLayout;