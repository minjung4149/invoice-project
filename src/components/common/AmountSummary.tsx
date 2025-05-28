"use client";
import React from "react";

interface AmountSummaryProps {
  total?: number;
  label?: string;
  months?: string[];
  selectedMonth?: string;
  onPrintClick?: () => void;
  onMonthChange?: (month: string) => void;
  sortKey?: "name" | "quantity" | "amount";
  onSortChange?: (field: "name" | "quantity" | "amount") => void;
  showSummaryContent?: boolean;
}

const AmountSummary = ({
                         total,
                         label,
                         months,
                         selectedMonth,
                         onPrintClick,
                         onMonthChange,
                         sortKey,
                         onSortChange,
                         showSummaryContent,
                       }: AmountSummaryProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMonthChange?.(e.target.value);
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

  const labelText = selectedMonth && label
    ? `${formatMonthForLabel(selectedMonth)} ${label} 합계`
    : `${label} 합계`;

  return (
    <div className="amount-summary">
      <div className="summary-header">
        {Array.isArray(months) && months.length > 0 && selectedMonth && (
          <select className="month-selector" value={selectedMonth} onChange={handleChange}>
            {[...new Set(months)]
              .filter((m): m is string => m.includes("-"))
              .sort((a, b) => b.localeCompare(a))
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

      {showSummaryContent !== false && (
        <div className="summary-content">
          <p className="summary-label">{labelText}</p>
          <p className="summary-amount">{total?.toLocaleString()} 원</p>
        </div>
      )}

      {sortKey && onSortChange && (
        <div className="sort-buttons">
          <button
            className={`sort-button${sortKey === "name" ? " active" : ""}`}
            onClick={() => onSortChange("name")}
          >
            품목순
          </button>
          <button
            className={`sort-button${sortKey === "quantity" ? " active" : ""}`}
            onClick={() => onSortChange("quantity")}
          >
            수량순
          </button>
          <button
            className={`sort-button${sortKey === "amount" ? " active" : ""}`}
            onClick={() => onSortChange("amount")}
          >
            판매순
          </button>
        </div>
      )}
    </div>
  );
};

export default AmountSummary;
