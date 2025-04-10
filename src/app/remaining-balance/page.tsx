import React from 'react';
import BalanceTable from "@/components/balance/BalanceTable";
import HeaderHome from "@/components/header/HeaderHome";
import BalanceSummary from "@/components/balance/BalanceSummary";
import {getClientBalance} from "@/utils/api";

// 거래처 잔금 정보를 위한 타입 정의
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
    // 서버에서 거래처 잔금 데이터 호출
    balanceData = await getClientBalance();
    console.log("받은 값:", balanceData);

    // 전체 잔금 합계 계산
    totalBalance = balanceData.reduce(
      (sum: number, client: ClientBalance) => sum + client.balance,
      0
    );
  } catch (error) {
    // API 호출 실패 시: 빈 배열과 0으로 초기화
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
              {/* 거래처별 잔금 리스트 테이블 */}
              <BalanceTable data={balanceData}/>

              {/* 전체 잔금 합계 요약 컴포넌트 */}
              <BalanceSummary total={totalBalance}/>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default BalancePage;