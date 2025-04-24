"use client";
import React, {useState, useRef, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import HistoryTable from "@/components/history/HistoryTable";
import HistoryTemplate from "@/components/history/HistoryTemplate";
import {getInvoiceById} from "@/utils/api";

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

/**
 * OrderHistoryClient 컴포넌트
 *
 * 거래처 주문 내역 페이지의 클라이언트 전용 컴포넌트
 * - URL 쿼리에서 거래처 ID 및 이름을 추출
 * - 주문 리스트(HistoryTable)와 상세 보기(HistoryTemplate)를 조합하여 보여줌
 * - 주문 선택 시 상세 정보를 업데이트하여 하단에 출력
 */
const OrderHistoryClient = () => {
  const searchParams = useSearchParams();
  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(null);

  // URL 파라미터에서 거래처 ID, 이름 추출
  const clientId = Number(searchParams.get("clientId") || 1);
  const clientName = searchParams.get("name") || "";

  // 선택된 주문 데이터를 상태로 관리
  const [selectedOrder, setSelectedOrder] = useState({
    id: 0,
    createDate: "",
    total: "0",
    balance: "0",
  });

  // 선택된 주문 ID가 바뀔 때마다 상세 내역 호출
  useEffect(() => {
    if (!selectedOrder || selectedOrder.id === 0) return;

    const fetchDetail = async () => {
      try {
        const raw = await getInvoiceById(selectedOrder.id);

        console.log("상세 내역:", raw);

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

        const subtotal = raw.subtotal ?? items.reduce((sum, item) => sum + item.total, 0);
        const prevBalance = raw.previousBalance ?? 0;
        const total = raw.total ?? subtotal + prevBalance;
        const payment = raw.payment ?? 0;
        const balance = raw.balance ?? (total - payment);
        const note = raw.note ?? "";

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

  const printRef = useRef<HTMLDivElement>(null);
  const printable = <HistoryTemplate selectedOrder={selectedOrder} invoiceDetail={invoiceDetail}/>;
  return (
    <>
      <main className="site-content">
        <div className="container">
          <div className="main-wrapper">
            <div className="order-history">
              {/* 주문 테이블에서 선택한 주문 데이터를 저장 */}
              <HistoryTable
                clientId={clientId}
                clientName={clientName}
                onSelectOrder={setSelectedOrder}
              />

              {/* 선택된 주문 정보 전달 */}
              <HistoryTemplate selectedOrder={selectedOrder} invoiceDetail={invoiceDetail} ref={printRef}/>
            </div>
          </div>
        </div>
      </main>

      {/* 인쇄 영역 */}
      <div style={{display: "none"}}>
        <div id="print-area">
          <div style={{display: "flex", flexDirection: "row", gap: 0, width: "210mm"}}>
            <div className="print-half">{printable}</div>
            <div className="print-half">{printable}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderHistoryClient;
