import React from 'react';

const BalanceSummary = () => {
  const totalBalance = 1250000; // 예제 데이터

  return (
    <div className="balance-summary">
      <div className="summary-container">
        <h3>잔금 합계</h3>
        <p className="total-amount under-line">{totalBalance.toLocaleString()} 원</p>
      </div>
    </div>
  );
};

export default BalanceSummary;
