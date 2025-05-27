import React from 'react';
import HeaderHome from "@/components/header/HeaderHome";
import ClientAmountSection from "@/components/common/ClientAmountSection";
import {getClientSales} from "@/utils/api";


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
    console.log("초기 매출 데이터:", clients);
  } catch (error) {
    console.error("초기 매출 데이터 불러오기 실패:", error);
  }

  const tableData = clients.map((item: any) => ({
    clientId: item.clientId,
    name: item.name,
    phone: item.phone,
    latestInvoiceDate: item.latestDate,
    amount: item.totalSales,
  }));

  const totalSales = tableData.reduce((sum: number, item: any) => {
    return sum + Number(item.totalSales);
  }, 0);
  console.log("총 매출:", totalSales);

  return (
    <>
      <HeaderHome/>
      <main className="site-content">
        <div className="container">
          <ClientAmountSection
            data={tableData}
            label="매출"
            total={totalSales}
            months={[currentMonth]}
          />
        </div>
      </main>
    </>
  );
};

export default ClientMonthlyPage;
