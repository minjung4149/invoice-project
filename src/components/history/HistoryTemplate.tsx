import React, {useEffect, useState} from "react";
import {getInvoiceById} from "@/utils/api";
import {useSearchParams} from "next/navigation";
import {formatDate} from "@/utils/date";

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

/**
 * HistoryTemplate 컴포넌트
 *
 * - 선택된 주문의 상세 인보이스 데이터를 불러와 출력
 * - 품목 테이블 + 요약 정보(소계, 전잔금, 입금, 잔금, 비고) 제공
 */
const HistoryTemplate = ({selectedOrder}: HistoryTemplateProps) => {
  const searchParams = useSearchParams(); // URL 파라미터 접근
  const clientName = searchParams.get("name") || ""; // 클라이언트 이름

  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(null);

  // 선택된 주문 ID가 바뀔 때마다 상세 내역 호출
  useEffect(() => {
    if (!selectedOrder || selectedOrder.id === 0) return;

    const fetchDetail = async () => {
      try {
        const raw = await getInvoiceById(selectedOrder.id);

        // 서버에서 받은 상세 품목 데이터를 프론트에서 직접 가공
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
        const prevBalance = raw.client?.balance ?? 0; // 서버에서 값으로 교체 예정
        const total = subtotal + prevBalance;
        const payment = 0; // 서버에서 값으로 교체 예정
        const balance = total - payment;
        const note = ""; // 서버에서 값으로 교체 예정

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
      {/* 계산서 제목 */}
      <div className="invoice-title">
        <h2>計 算 書</h2>
        <h3>대구중앙청과(주) 지정 중도매인 20번</h3>
      </div>

      <div className="invoice-header">
        {/* 좌측: 업체 정보 */}
        <div className="header-left">
          <p className="store"><strong>{clientName}</strong> <span>貴下</span></p>
          <div className="invoice-date">
            {selectedOrder.createDate && (() => {
              const [datePart] = formatDate(selectedOrder.createDate).split(" "); // "YYYY-MM-DD"
              const [year, month, day] = datePart.split("-");
              return (
                <>
                  <p>
                    西紀 {year}년 {month}월 {day}일
                  </p>
                  <p>下記와 如히 計算함</p>
                </>
              );
            })()}
          </div>
        </div>


        {/* 우측: 판매자 정보 */}
        <div className="header-right">
          <p className="spacing"><strong>중앙영농 (주)</strong></p>
          <p className="spacing">서영민</p>
          <p>대구광역시 북구 매천로18길 34</p>
          <p><strong>전화:</strong> (053) 311-4149</p>
          <p><strong>휴대폰:</strong> 010-8596-4149</p>
          <p><strong>휴대폰:</strong> 010-3532-4149</p>
        </div>
      </div>

      <hr className="divider"/>

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

      {/* 구분선 */}
      <hr className="divider"/>

      {/* 푸터 */}
      <div className="invoice-footer">
        <p>농협: 317-0003-6690-11 중앙영농(주)</p>
      </div>
    </div>
  );
}

export default HistoryTemplate;
