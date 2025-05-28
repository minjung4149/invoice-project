"use client";
import React, { useRef, useState, useEffect } from "react";
import ProductAmountTable from "@/components/common/ProductAmountTable";
import AmountSummary from "@/components/common/AmountSummary";
import { getMonthlySales } from "@/utils/api";

interface ProductSalesRow {
  itemId: number;
  name: string;
  spec?: string;
  quantity: number;
  amount: number;
}

interface ProductAmountProps {
  data: ProductSalesRow[];
  months: string[];
  label: string;
  initialMonth: string;
}

const ProductAmountSection = ({ data, months, label, initialMonth }: ProductAmountProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [productData, setProductData] = useState(data);
  const [totalAmount, setTotalAmount] = useState(
    data.reduce((sum, item) => sum + item.amount, 0));
  const [availableMonths, setAvailableMonths] = useState(months);

  //셀렉트 박스에서 기존에 없던 새로운 월을 선택했을 경우, 그 월을 availableMonths 배열에 자동으로 추가
  useEffect(() => {
    if (!availableMonths.includes(selectedMonth)) {
      setAvailableMonths((prev) => [...prev, selectedMonth]);
    }
  }, [selectedMonth, availableMonths]);

  const handleMonthChange = async (month: string) => {
    setSelectedMonth(month);

    try {
      const res = await getMonthlySales(month);
      const newData = res.map((item: ProductSalesRow, index: number) => ({
        itemId: index + 1,
        name: item.name,
        spec: item.spec,
        quantity: item.quantity,
        amount: item.amount,
      }));

      const newDataTotalAmount = newData.reduce((acc: number, cur: ProductSalesRow) => acc + Number(cur.amount), 0);

      setProductData(newData);
      setTotalAmount(newDataTotalAmount);

      if (!availableMonths.includes(month)) {
        setAvailableMonths((prev) => [...prev, month]);
      }
    } catch (e) {
      console.error("월별 판매 데이터 불러오기 실패:", e);
    }
  };

  const formatMonthOnly = (month?: string) => {
    if (!month) return "";
    const [, m] = month.split("-");
    return `${parseInt(m, 10)}월`;
  };

  const dynamicLabel = selectedMonth ? `${formatMonthOnly(selectedMonth)} ${label}` : label;

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
          <ProductAmountTable data={productData} amountLabel={dynamicLabel} />
        </div>
        <AmountSummary
          total={totalAmount}
          label={label}
          months={availableMonths}
          selectedMonth={selectedMonth}
          onPrintClick={handlePrint}
          onMonthChange={handleMonthChange}
        />
      </div>
    </div>
  );
};

export default ProductAmountSection;
