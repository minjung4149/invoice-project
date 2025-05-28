"use client";
import React, {useRef, useState, useEffect} from "react";
import ClientAmountTable from "@/components/common/ClientAmountTable";
import AmountSummary from "@/components/common/AmountSummary";
import {getClientSales} from "@/utils/api";

interface ClientAmountProps {
  data: {
    clientId: number;
    name: string;
    phone?: string;
    latestDate: string;
    amount: number;
  }[];
  initTotalAmount: number;
  label: string;
  months: string[];
}

const ClientAmountSection = ({data, initTotalAmount, label, months}: ClientAmountProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [clientData, setClientData] = useState(data);
  const [totalAmount, setTotalAmount] = useState(initTotalAmount);
  const [availableMonths, setAvailableMonths] = useState<string[]>(months);

  useEffect(() => {
    if (!availableMonths.includes(selectedMonth)) {
      setAvailableMonths((prev) => [...prev, selectedMonth]);
    }
  }, [selectedMonth, availableMonths]);


  const handleMonthChange = async (month: string) => {
    setSelectedMonth(month);

    try {
      const res = await getClientSales(month);
      const newData = res.map((item: any) => ({
        clientId: item.clientId,
        name: item.name,
        phone: item.phone,
        latestDate: item.latestDate,
        amount: Number(item.totalSales),
      }));

      const newDataTotalAmount = newData.reduce((acc: number, cur: any) => acc + Number(cur.amount), 0);

      setClientData(newData);
      setTotalAmount(newDataTotalAmount);

      // 월 목록에 없으면 추가
      if (!availableMonths.includes(month)) {
        setAvailableMonths((prev) => [...prev, month]);
      }
    } catch (e) {
      console.error("월별 매출 데이터 불러오기 실패:", e);
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
    <>
      <div className="main-wrapper">
        <div className="amount-wrapper">
          <div ref={printRef} className="amount-list">
            <ClientAmountTable data={clientData} amountLabel={dynamicLabel}/>
          </div>

          <AmountSummary
            total={totalAmount}
            label={label}
            months={availableMonths}
            onPrintClick={handlePrint}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>
    </>

  );
};

export default ClientAmountSection;
