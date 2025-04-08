import React from 'react';

interface BalanceSummaryProps {
  total: number;
}

const BalanceSummary = ({total}: BalanceSummaryProps) => {
  return (
    <div className="balance-summary">
      <div className="summary-container">
        <h3>잔금 합계</h3>
        <p className="total-amount under-line">{total.toLocaleString()} 원</p>
      </div>
    </div>
  );
};

export default BalanceSummary;
