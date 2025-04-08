import React, {useEffect, useState} from "react";
import {getInvoiceById} from "@/utils/api";


interface OrderData {
  id: number;
  createDate: string;
  total: string;
  balance: string;
}

// 품목 데이터 타입
interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

// API 응답으로 받아올 상세 주문 정보 타입
interface InvoiceDetail {
  items: Item[];
  subtotal: number;
  prevBalance: number;
  total: number;
  payment: number;
  balance: number;
  note?: string;
}

interface HistoryTemplateProps {
  selectedOrder: OrderData; // 선택된 주문 데이터
}

const HistoryTemplate: React.FC<HistoryTemplateProps> = ({selectedOrder}) => {
  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(null);

  // 선택된 주문 ID가 바뀔 때마다 상세 내역 호출
  useEffect(() => {
    if (!selectedOrder || selectedOrder.id === 0) return;

    const fetchDetail = async () => {
      try {
        const raw = await getInvoiceById(selectedOrder.id);

        // 하드코딩 + 프론트 가공
        const items: Item[] = (raw.details as Array<{
          name: string;
          quantity: number;
          price: number
        }>).map((item, idx) => {
          const total = item.price * item.quantity;
          return {
            id: idx + 1,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total,
          };
        });

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const prevBalance = raw.client?.balance ?? 0;
        const total = subtotal + prevBalance;
        const payment = 10000; // 하드코딩
        const balance = total - payment;
        const note = "하드코딩"; // 하드코딩

        setInvoiceDetail({
          items,
          subtotal,
          prevBalance,
          total,
          payment,
          balance,
          note,
        });
      } catch (err) {
        console.error("상세 내역 불러오기 실패:", err);
      }
    };

    fetchDetail();
  }, [selectedOrder]);


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
        {invoiceDetail && (
          <tbody>
          {invoiceDetail.items.map((item, idx) => (
            <tr key={item.id}>
              <td className="no">{idx + 1}</td>
              <td className="name">{item.name}</td>
              <td className="quantity">{item.quantity}</td>
              <td className="price">{item.price.toLocaleString()} 원</td>
              <td className="total">{item.total.toLocaleString()} 원</td>
            </tr>
          ))}
          </tbody>
        )}
      </table>

      {/* 구분선 */}
      <hr className="divider"/>

      {/* 거래 요약 */}
      {invoiceDetail && (
        <div className="invoice-summary">
          <p>
            <span>소계:</span>
            <span className="summary-value">{invoiceDetail.subtotal.toLocaleString()} 원</span>
          </p>
          <hr className="divider"/>
          <p>
            <span>전잔금:</span>
            <span className="summary-value">{invoiceDetail.prevBalance.toLocaleString()} 원</span>
          </p>
          <hr className="divider"/>
          <p>
            <span>합계:</span>
            <span className="summary-value">{invoiceDetail.total.toLocaleString()} 원</span>
          </p>
          <hr className="divider"/>
          <p>
            <span>입금:</span>
            <span className="summary-value">{invoiceDetail.payment.toLocaleString()} 원</span>
          </p>
          <hr className="divider"/>
          <p>
            <span>잔금:</span>
            <span className="summary-value">{invoiceDetail.balance.toLocaleString()} 원</span>
          </p>
          <hr className="divider"/>
          <p>
            <span>비고:</span>
            <span className="summary-value">{invoiceDetail.note || ""}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default HistoryTemplate;
