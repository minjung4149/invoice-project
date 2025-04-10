import React from 'react';

interface BalanceSummaryProps {
  total: number; // 전체 거래처 잔금 합계
}

/**
 * BalanceSummary 컴포넌트
 *
 * 전체 거래처의 잔금 합계를 시각적으로 보여주는 요약 컴포넌트
 * - props로 전달받은 total 값을 통화 형식(천 단위 콤마)으로 출력
 * - 단순한 합계 출력이지만, 시각적으로 강조되는 UI 요소로 활용됨
 */
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
