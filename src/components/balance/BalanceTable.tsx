import React from 'react';

// 거래처 데이터 (잔금 기준 내림차순 정렬)
const balanceData = [
  {id: 1, store: "나이스 마트", contact: "010-1234-5678", date: "2025-02-10 (토)", balance: 500000},
  {id: 2, store: "굿스토어", contact: "010-2345-6789", date: "2025-02-08 (목)", balance: 300000},
  {id: 3, store: "행복 슈퍼", contact: "010-3456-7890", date: "2025-02-07 (수)", balance: 0},
  {id: 4, store: "웰빙 마트", contact: "010-4567-8901", date: "2025-02-06 (화)", balance: 100000},

].sort((a, b) => b.balance - a.balance); // 잔금 기준 내림차순 정렬

const BalanceTable = () => {
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
          {balanceData.map(({id, store, contact, date, balance}) => (
            <tr key={id}>
              <td className="id">{id}</td>
              <td className="date">{date}</td>
              <td className="store">{store}</td>
              <td className="contact">{contact}</td>

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
