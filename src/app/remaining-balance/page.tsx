import React from 'react';
import BalanceTable from "@/components/balance/BalanceTable";
import HeaderHome from "@/components/header/HeaderHome";
import BalanceSummary from "@/components/balance/BalanceSummary";
import {getClientBalance} from "@/utils/api";

interface ClientBalance {
  clientId: number;
  name: string;
  phone: string;
  balance: number;
  latestInvoiceDate: string;
}

const BalancePage = async () => {
  let balanceData: ClientBalance[] = [];
  let totalBalance: number = 0;

  try {
    balanceData = await getClientBalance();
    console.log("받은 값:", balanceData);

    totalBalance = balanceData.reduce(
      (sum: number, client: ClientBalance) => sum + client.balance,
      0
    );
  } catch (error) {
    console.error("잔금 데이터 호출 실패:", error);
    // fallback: 빈 배열과 0 처리
    balanceData = [];
    totalBalance = 0;
  }

  return (
    <>
      <HeaderHome/>
      <main className="site-content">
        <div className="container">
          <div className="main-wrapper">
            <div className="balance-wrapper">
              <BalanceTable data={balanceData}/>
              <BalanceSummary total={totalBalance}/>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default BalancePage;