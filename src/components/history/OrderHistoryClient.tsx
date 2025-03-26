"use client";
import React, {useState} from "react";
import HistoryTable from "@/components/history/HistoryTable";
import HistoryTemplate from "@/components/history/HistoryTemplate";

const OrderHistoryClient = () => {
  const [selectedOrder, setSelectedOrder] = useState({
    id: 0,
    date: "",
    total: "0",
    balance: "0",
  });

  return (
    <main className="site-content">
      <div className="container">
        <div className="main-wrapper">
          <div className="order-history">
            {/* 주문 테이블에서 선택한 주문 데이터를 저장 */}
            <HistoryTable onSelectOrder={setSelectedOrder}/>
            {/* 선택된 주문 정보 전달 */}
            <HistoryTemplate selectedOrder={selectedOrder}/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderHistoryClient;
