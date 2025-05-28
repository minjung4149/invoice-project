import React from 'react';
import HeaderHome from "@/components/header/HeaderHome";
import ClientAmountSection from "@/components/common/ClientAmountSection";
import {getClientSales} from "@/utils/api";

interface ClientSales {
  clientId: number;
  name: string;
  phone?: string;
  latestDate: string;
  totalSales: number | string;
}

interface ClientRow {
  clientId: number;
  name: string;
  phone?: string;
  latestDate: string;
  amount: number;
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
  console.log("현재 월:", currentMonth);
  let clients = [];
  try {
    clients = await getClientSales(currentMonth);
  } catch (error) {
    console.error("초기 매출 데이터 불러오기 실패:", error);
  }

  const tableData = clients.map((item: ClientSales) => ({
    clientId: item.clientId,
    name: item.name,
    phone: item.phone,
    latestDate: item.latestDate,
    amount: Number(item.totalSales),
  }));

  const totalSalesSum = tableData.reduce((sum: number, item: ClientRow) => {
    return sum + Number(item.amount);
  }, 0);
  console.log("총 매출 합계:", totalSalesSum);

  return (
    <>
      <HeaderHome/>
      <main className="site-content">
        <div className="container">
          <ClientAmountSection
            data={tableData}
            label="매출"
            initTotalAmount={totalSalesSum}
            months={[currentMonth]}
          />
        </div>
      </main>
    </>
  );
};

export default ClientMonthlyPage;
