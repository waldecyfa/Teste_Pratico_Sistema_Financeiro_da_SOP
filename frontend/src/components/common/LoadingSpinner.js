'use client';

import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center my-5">
      <Spinner animation="border" role="status" variant="primary" className="mb-2">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="text-muted">{text}</p>
    </div>
  );
};

export default LoadingSpinner;