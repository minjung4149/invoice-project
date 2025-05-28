import React from 'react';
import HeaderHome from "@/components/header/HeaderHome";
import ClientAmountSection from "@/components/common/ClientAmountSection";
import {getClientSales} from "@/utils/api";
import {getMonthsSince} from "@/utils/getMonthsSince";

interface ClientSales {
  clientId: number;
  name: string;
  phone?: string;
  latestDate: string;
  totalSales: number | string;
}

// 오늘 날짜 기준으로 YYYY-MM 문자열 생성
const getTodayMonth = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const ClientMonthlyPage = async () => {
  const currentMonth = getTodayMonth();
  const months = getMonthsSince("2025-05"); // 누적 월 자동 생성

  let clients: ClientSales[] = [];

  try {
    clients = await getClientSales(currentMonth);
  } catch (error) {
    console.error("초기 매출 데이터 불러오기 실패:", error);
  }

  const tableData = clients.map((item) => ({
    clientId: item.clientId,
    name: item.name,
    phone: item.phone,
    latestDate: item.latestDate,
    amount: Number(item.totalSales),
  }));

  const totalSalesSum = tableData.reduce((sum, item) => sum + item.amount, 0);


  return (
    <>
      <HeaderHome/>
      <main className="site-content">
        <div className="container">
          <ClientAmountSection
            data={tableData}
            label="매출"
            initTotalAmount={totalSalesSum}
            initialMonth={currentMonth}
            months={months}
          />
        </div>
      </main>
    </>
  );
};

export default ClientMonthlyPage;
