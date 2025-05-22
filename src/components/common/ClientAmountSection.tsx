"use client";
import React, {useRef, useState, useEffect} from "react";
import ClientAmountTable from "./ClientAmountTable";
import AmountSummary from "./AmountSummary";

interface Props {
  data: {
    clientId: number;
    name: string;
    phone?: string;
    latestInvoiceDate: string;
    amount: number;
  }[];
  total: number;
  label: string;
  months: string[];
}

const ClientAmountSection = ({data, total, label, months}: Props) => {
  const printRef = useRef<HTMLDivElement>(null);

  // 선택된 월 상태는 상위에서 관리 (기본값: 첫 번째 월 또는 undefined)
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (months && months.length > 0) {
      setSelectedMonth(months[0]);
    }
  }, [months]);
  ;

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  // "2025-05" -> "5월"
  const formatMonthOnly = (month?: string) => {
    if (!month) return "";
    const [, m] = month.split("-");
    return `${parseInt(m, 10)}월`;
  };

  // 동적 라벨 조합 (월 존재 시만)
  const dynamicLabel =
    months && selectedMonth ? `${formatMonthOnly(selectedMonth)} ${label}` : label;


  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <>
      <div className="main-wrapper">
        <div className="amount-wrapper">
          <div ref={printRef} className="amount-list">
            <ClientAmountTable data={data} amountLabel={dynamicLabel}/>
          </div>

          <AmountSummary
            total={total}
            label={label}
            months={months}
            onPrintClick={handlePrint}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>
    </>

  );
};

export default ClientAmountSection;
