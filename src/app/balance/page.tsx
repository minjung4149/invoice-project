import React from 'react';
import HeaderHome from "@/components/header/HeaderHome";
import {getClientBalance} from "@/utils/api";
import ClientAmountSection from "@/components/common/ClientAmountSection";

// 서버 응답 타입
interface ClientBalance {
  clientId: number;
  name: string;
  phone: string;
  balance: number;
  latestInvoiceDate: string;
}

// 공통 컴포넌트에 맞춘 변환 타입
interface ClientRow {
  clientId: number;
  name: string;
  phone: string;
  latestInvoiceDate: string;
  amount: number;
}

const BalancePage = async () => {
  let rawData: ClientBalance[] = [];
  let tableData: ClientRow[] = [];
  let total: number = 0;

  try {
    // 서버에서 거래처 잔금 데이터 호출
    rawData = await getClientBalance();

    // 잔액 있는 거래처만 필터링
    const filtered = rawData.filter(client => client.balance > 0);

    // amount 필드로 변환하여 공통 테이블에 전달
    tableData = filtered.map((client) => ({
      clientId: client.clientId,
      name: client.name,
      phone: client.phone,
      latestInvoiceDate: client.latestInvoiceDate,
      amount: client.balance, // 공통 필드로 맞춤
    }));

    // 총 잔금 계산
    total = tableData.reduce((sum, client) => sum + client.amount, 0);
  } catch (error) {
    console.error("잔금 데이터 불러오기 실패:", error);
    tableData = [];
    total = 0;
  }

  return (
    <>
      <HeaderHome/>
      <main className="site-content">
        <div className="container">
          <ClientAmountSection
            data={tableData}
            total={total}
            label="잔금"
            months={[]}
          />
        </div>
      </main>
    </>
  );
}

export default BalancePage;