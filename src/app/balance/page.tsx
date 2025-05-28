import React from "react";
import HeaderHome from "@/components/header/HeaderHome";
import {getClientBalance} from "@/utils/api";
import ClientAmountSection from "@/components/common/ClientAmountSection";

interface ClientBalance {
  clientId: number;
  name: string;
  phone?: string;
  latestInvoiceDate: string;
  balance: number;
}

const BalancePage = async () => {
  const rawData: ClientBalance[] = await getClientBalance().catch((error) => {
    console.error("잔금 데이터 불러오기 실패:", error);
    return []; // fallback to empty array
  });

  const tableData = rawData
    .filter(client => client.balance > 0)
    .map(client => ({
      clientId: client.clientId,
      name: client.name,
      phone: client.phone,
      latestDate: client.latestInvoiceDate,
      amount: client.balance,
    }));

  const initTotalAmount = tableData.reduce((sum, client) => sum + client.amount, 0);

  return (
    <>
      <HeaderHome/>
      <main className="site-content">
        <div className="container">
          <ClientAmountSection
            data={tableData}
            initTotalAmount={initTotalAmount}
            label="잔금"
            months={[]} // 달 선택 없이
          />
        </div>
      </main>
    </>
  );
};

export default BalancePage;
