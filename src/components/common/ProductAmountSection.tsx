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
  const [availableMonths, setAvailableMonths] = useState(months);
  const [sortKey, setSortKey] = useState<"name" | "quantity" | "amount">("quantity");
  const [productData, setProductData] = useState<ProductSalesRow[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const sortByKey = (data: ProductSalesRow[], key: typeof sortKey) => {
    return [...data].sort((a, b) => {
      if (key === "name") return a.name.localeCompare(b.name); // 오름차순
      return b[key] - a[key]; // 수량/판매 내림차순
    });
  };

  const applySort = (data: ProductSalesRow[], key: typeof sortKey) => {
    const sorted = sortByKey(data, key);
    setProductData(sorted);
    setTotalAmount(sorted.reduce((sum, item) => sum + item.amount, 0));
  };

  useEffect(() => {
    const initialData = data.map((item, idx) => ({ ...item, itemId: idx + 1 }));
    applySort(initialData, sortKey);
  }, []);

  const handleMonthChange = async (month: string) => {
    setSelectedMonth(month);

    try {
      const res = await getMonthlySales(month);
      const newData: ProductSalesRow[] = res.map((item: Omit<ProductSalesRow, "itemId">, idx: number): ProductSalesRow => ({
        itemId: idx + 1,
        ...item,
      }));
      applySort(newData, sortKey);

      if (!availableMonths.includes(month)) {
        setAvailableMonths((prev) => [...prev, month]);
      }
    } catch (e) {
      console.error("월별 판매 데이터 불러오기 실패:", e);
    }
  };

  const handleSortChange = (field: typeof sortKey) => {
    setSortKey(field);
    applySort(productData, field);
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
          sortKey={sortKey}
          onPrintClick={handlePrint}
          onMonthChange={handleMonthChange}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
};

export default ProductAmountSection;
