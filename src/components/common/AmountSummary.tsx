"use client";

import React, {useState} from "react";

interface AmountSummaryProps {
  total: number;
  label?: string; // "매출" 또는 "잔금"
  months?: string[]; // 선택 가능한 월 목록 (예: ["2025-05", "2025-04"])
}

const AmountSummary = ({total, label, months}: AmountSummaryProps) => {
  const [selectedMonth, setSelectedMonth] = useState(
    months && months.length > 0 ? months[0] : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  // "2025-05" → "2025년 5월"
  const formatMonthForSelect = (month: string) => {
    const [year, m] = month.split("-");
    return `${year}년 ${parseInt(m, 10)}월`;
  };

  // "2025-05" → "5월"
  const formatMonthForLabel = (month: string) => {
    const [, m] = month.split("-");
    return `${parseInt(m, 10)}월`;
  };

  // 표시용 라벨
  const labelText =
    months && selectedMonth
      ? `${formatMonthForLabel(selectedMonth)} ${label} 합계`
      : `${label} 합계`;

  return (
    <div className="amount-summary">
      {months && (

          <select className="month-selector" value={selectedMonth} onChange={handleChange}>
            {months.map((month) => (
              <option key={month} value={month}>
                {formatMonthForSelect(month)}
              </option>
            ))}
          </select>

      )}

      <div className="summary-content">
        <p className="summary-label">{labelText}</p>
        <p className="summary-amount">{total.toLocaleString()} 원</p>
      </div>
    </div>
  );
};

export default AmountSummary;
