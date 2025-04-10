import React from 'react';
import {formatDate} from "@/utils/date";
import {formatPhone} from "@/utils/format";

// 거래처 잔금 정보를 위한 타입
interface ClientBalance {
  clientId: number;
  name: string;
  phone: string;
  balance: number;
  latestInvoiceDate: string;
}

interface BalanceTableProps {
  data: ClientBalance[]; // 잔금 정보 배열
}

/**
 * BalanceTable 컴포넌트
 *
 * 거래처별 잔금 현황을 표 형태로 출력하는 컴포넌트
 * - props로 전달된 거래처 잔금 리스트를 잔금 기준으로 내림차순 정렬하여 표시
 * - 최근 거래 날짜, 거래처명, 연락처, 잔금을 테이블 형태로 구성
 * - 날짜는 formatDate, 연락처는 formatPhone 유틸 함수로 포맷 처리
 */
const BalanceTable = ({data}: BalanceTableProps) => {
  // 잔금 기준으로 내림차순 정렬
  const sorted = [...data].sort((a, b) => b.balance - a.balance);

  return (
    <div className="balance-list">
      <div className="table-container">
        {/* 주문 내역 테이블 */}
        <table className="balance-table">
          <thead>
          <tr>
            <th>No</th>
            <th>최근 거래 날짜</th>
            <th>거래처 명</th>
            <th>연락처</th>
            <th>잔금</th>
          </tr>
          </thead>
          <tbody>
          {sorted.map(({clientId, name, phone, latestInvoiceDate, balance}, index) => (
            <tr key={clientId}>
              <td className="id">{index + 1}</td>
              <td className="date">{formatDate(latestInvoiceDate)}</td>
              <td className="store">{name}</td>
              <td className="contact">{formatPhone(phone)}</td>

              {/* 잔금 표시 (금액이 0보다 크면 강조 표시 클래스 추가) */}
              <td className={`balance ${balance > 0 ? "balance-positive" : ""}`}>
                {balance.toLocaleString()}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceTable;
