'use client';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    if (!status) return 'status-badge status-awaiting-commitment';
    
    const statusLower = status.toLowerCase().replace('_', '-');
    
    switch (statusLower) {
      case 'awaiting-commitment':
        return 'status-badge status-awaiting-commitment';
      case 'partially-committed':
        return 'status-badge status-partially-committed';
      case 'awaiting-payment':
        return 'status-badge status-awaiting-payment';
      case 'partially-paid':
        return 'status-badge status-partially-paid';
      case 'paid':
        return 'status-badge status-paid';
      default:
        return 'status-badge status-awaiting-commitment';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace('_', ' ');
  };

  return (
    <span className={getStatusClass(status)}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;