"use client";
import React, {useState} from "react";
import {useSearchParams} from "next/navigation";
import HistoryTable from "@/components/history/HistoryTable";
import HistoryTemplate from "@/components/history/HistoryTemplate";

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

  return (
    <main className="site-content">
      <div className="container">
        <div className="main-wrapper">
          <div className="order-history">
            {/* 주문 테이블에서 선택한 주문 데이터를 저장 */}
            <HistoryTable clientId={clientId} clientName={clientName} onSelectOrder={setSelectedOrder}/>
            {/* 선택된 주문 정보 전달 */}
            <HistoryTemplate selectedOrder={selectedOrder}/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderHistoryClient;
