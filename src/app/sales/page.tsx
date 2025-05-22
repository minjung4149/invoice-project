import React from 'react';
import HeaderHome from "@/components/header/HeaderHome";
import ClientAmountSection from "@/components/common/ClientAmountSection";

// 거래처 매출 정보 타입
interface MonthlySales {
  clientId: number;
  name: string;
  phone?: string;
  sales: number;
  latestInvoiceDate: string;
}

// // 가데이터 (2025년 5월 기준)
const dummySalesData: MonthlySales[] = [
  {
    clientId: 1,
    name: "테스트 상회",
    phone: "01012345678",
    sales: 10446000,
    latestInvoiceDate: "2025-05-20T15:00:00",
  },
  {
    clientId: 2,
    name: "한솔상사",
    phone: "01098765432",
    sales: 8480000,
    latestInvoiceDate: "2025-05-18T10:30:00",
  },
  {
    clientId: 3,
    name: "나이스마트",
    phone: "01055556666",
    sales: 1250000,
    latestInvoiceDate: "2025-05-14T11:20:00",
  },
];

const availableMonths = ["2025-05", "2025-04", "2025-03"];

const MonthlySalesPage = async () => {
  const tableData = dummySalesData.map((item) => ({
    clientId: item.clientId,
    name: item.name,
    phone: item.phone,
    latestInvoiceDate: item.latestInvoiceDate,
    amount: item.sales,
  }));

  const totalSales = tableData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      <HeaderHome/>
      <main className="site-content">
        <div className="container">
          <ClientAmountSection
            data={tableData}
            label="매출"
            total={totalSales}
            months={availableMonths}
          />
        </div>
      </main>
    </>
  );
};

export default MonthlySalesPage;
