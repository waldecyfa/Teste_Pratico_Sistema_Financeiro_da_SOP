'use client';

const DateFormat = ({ date, className }) => {
  if (!date) return <span className={className}>-</span>;
  
  // Convert string date to Date object if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format the date as DD/MM/YYYY
  const formattedDate = dateObj.toLocaleDateString('pt-BR');
  
  return <span className={className}>{formattedDate}</span>;
};

export default DateFormat;