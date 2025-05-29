"use client";
import React from "react";

// 컴포넌트에서 사용하는 props 타입 정의
interface AmountSummaryProps {
  total?: number; // 총합 금액
  label?: string; // 라벨 (예: "매출")
  months?: string[]; // 선택 가능한 월 목록 (예: ["2025-03", "2025-04"])
  selectedMonth?: string; // 현재 선택된 월
  onPrintClick?: () => void; // 인쇄 버튼 클릭 핸들러
  onMonthChange?: (month: string) => void; // 월 변경 시 호출
  sortKey?: "name" | "quantity" | "amount"; // 현재 정렬 기준
  onSortChange?: (field: "name" | "quantity" | "amount") => void; // 정렬 기준 변경 핸들러
  showSummaryContent?: boolean; // 요약 표시 여부 제어
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

  // 월 변경 시 부모에게 알림
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMonthChange?.(e.target.value);
  };

  // 셀렉트 박스 옵션에 사용할 형식 ("2025-03" → "2025년 3월")
  const formatMonthForSelect = (month?: string) => {
    if (!month || !month.includes("-")) return "";
    const [year, m] = month.split("-");
    return `${year}년 ${parseInt(m, 10)}월`;
  };

  // 요약 라벨에 사용할 형식 ("2025-03" → "2025년 3월")
  const formatMonthForLabel = (month: string) => {
    const [year, m] = month.split("-");
    return `${year}년 ${parseInt(m, 10)}월`;
  };

  // 선택된 월 및 라벨을 조합한 텍스트 ("2025년 3월 매출 합계")
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

        {/* 인쇄 버튼 */}
        {onPrintClick && (
          <button className="default print-button" onClick={onPrintClick}>
            인쇄
          </button>
        )}
      </div>

      {/* 요약 내용 표시 */}
      {showSummaryContent !== false && (
        <div className="summary-content">
          <p className="summary-label">{labelText}</p>
          <p className="summary-amount">{total?.toLocaleString()} 원</p>
        </div>
      )}

      {/* 정렬 버튼들 */}
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
