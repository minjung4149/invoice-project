"use client";
import React, {useState} from "react";

interface AmountSummaryProps {
  total?: number;
  label?: string;
  months?: string[];
  onPrintClick?: () => void;
  onMonthChange?: (month: string) => void;
  showSummaryContent?: boolean;
}

const AmountSummary = ({total, label, months, onPrintClick, onMonthChange, showSummaryContent}: AmountSummaryProps) => {
  const [selectedMonth, setSelectedMonth] = useState(
    months && months.length > 0 ? months[0] : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMonth(value);
    if (onMonthChange) {
      onMonthChange(value); // 선택된 월 부모로 전달
    }
  };

  const formatMonthForSelect = (month?: string) => {
    if (!month || !month.includes("-")) return "";
    const [year, m] = month.split("-");
    return `${year}년 ${parseInt(m, 10)}월`;
  };

  const formatMonthForLabel = (month: string) => {
    const [year, m] = month.split("-");
    return `${year}년 ${parseInt(m, 10)}월`;
  };

  const labelText =
    months && selectedMonth
      ? `${formatMonthForLabel(selectedMonth)} ${label} 합계`
      : `${label} 합계`;

  return (
    <div className="amount-summary">
      <div className="summary-header">
        {months && months.length > 0 && (
          <select
            className="month-selector"
            value={selectedMonth}
            onChange={handleChange}
          >
            {[...new Set(months)]
              .filter((m): m is string => typeof m === "string" && m.includes("-"))
              .map((month) => (
                <option key={month} value={month}>
                  {formatMonthForSelect(month)}
                </option>
              ))}
          </select>
        )}
        {onPrintClick && (
          <button className="default print-button" onClick={onPrintClick}>
            인쇄
          </button>
        )}
      </div>

      {showSummaryContent !== false && ( // 기본값은 true
        <div className="summary-content">
          <p className="summary-label">{labelText}</p>
          <p className="summary-amount">{total?.toLocaleString()} 원</p>
        </div>
      )}
    </div>
  );
};

export default AmountSummary;
