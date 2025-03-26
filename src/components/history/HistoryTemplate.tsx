import React from 'react';

interface OrderData {
  id: number;
  date: string;
  total: string;
  balance: string;
}

interface HistoryTemplateProps {
  selectedOrder: OrderData; // 선택된 주문 데이터
}

const HistoryTemplate: React.FC<HistoryTemplateProps> = ({selectedOrder}) => {
  return (
    <div className="invoice">
      {/* 품목 테이블 */}
      <table className="invoice-table">
        <thead>
        <tr>
          <th className="no">No.</th>
          <th className="name">품명</th>
          <th className="quantity">수량</th>
          <th className="price">단가</th>
          <th className="total">금액</th>
        </tr>
        </thead>
        {selectedOrder && (
          <tbody>
          <tr>
            <td className="no">1</td>
            <td className="name">사과</td>
            <td className="quantity">2</td>
            <td className="price">50,000</td>
            <td className="total">100,000</td>
          </tr>
          <tr>
            <td className="no">2</td>
            <td className="name">오렌지</td>
            <td className="quantity">5</td>
            <td className="price">40,000</td>
            <td className="total">200,000</td>
          </tr>
          </tbody>
        )}
      </table>

      {/* 구분선 */}
      <hr className="divider"/>

      {/* 거래 요약 */}
      <div className="invoice-summary">
        <p>
          <span>소계:</span>
          <span className="summary-value">300,000 원</span>
        </p>
        <hr className="divider"/>
        <p>
          <span>전잔금:</span>
          <span className="summary-value"> 0 원</span>
        </p>
        <hr className="divider"/>
        <p>
          <span>합계:</span>
          <span className="summary-value">300,000 원</span>
        </p>
        <hr className="divider"/>
        <p>
          <span>입금:</span>
          <span className="summary-value">270,000 원</span>
        </p>
        <hr className="divider"/>
        <p>
          <span>잔금:</span>
          <span className="summary-value">30,000 원</span>
        </p>
        <hr className="divider"/>
        <p>
          <span>비고:</span>
          <span className="summary-value"></span>
        </p>
      </div>
    </div>
  );
}

export default HistoryTemplate;
