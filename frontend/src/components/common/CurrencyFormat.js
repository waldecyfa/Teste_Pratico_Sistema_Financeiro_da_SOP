'use client';

const CurrencyFormat = ({ value, className }) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);

  return <span className={className}>{formattedValue}</span>;
};

export default CurrencyFormat;