"use client";
import React, {useRef, useState, useEffect} from "react";
import ProductAmountTable from "@/components/common/ProductAmountTable";
import AmountSummary from "@/components/common/AmountSummary";

interface ProductSalesProps {
  data: {
    itemId: number;
    name: string;
    spec: string;
    quantity: number;
    amount: number;
  }[];
  months: string[];
  label: string;
}

const ProductAmountSection = ({data, months, label}: ProductSalesProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (months && months.length > 0) {
      setSelectedMonth(months[0]);
    }
  }, [months]);

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
    <div className="main-wrapper">
      <div className="amount-wrapper">
        <div ref={printRef} className="amount-list">
          <ProductAmountTable data={data} amountLabel={dynamicLabel}/>
        </div>
        <AmountSummary
          months={months}
          onPrintClick={handlePrint}
          onMonthChange={handleMonthChange}
          showSummaryContent={false}
        />
      </div>
    </div>
  );
};

export default ProductAmountSection;
