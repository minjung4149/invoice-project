import React from 'react';
import {formatDate} from "@/utils/date";
import {formatPhone} from "@/utils/format";

interface ClientBalance {
  clientId: number;
  name: string;
  phone: string;
  balance: number;
  latestInvoiceDate: string;
}

interface BalanceTableProps {
  data: ClientBalance[];
}

const BalanceTable = ({data}: BalanceTableProps) => {
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

              {/* 잔금이 0보다 크면 'balance-positive' 클래스 추가 */}
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
