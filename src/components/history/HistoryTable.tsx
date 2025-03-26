"use client";
import React, {useState, useEffect, useRef, useReducer} from "react";
import {getInvoicesByClientId} from "@/utils/api";

// 주문 데이터 타입 정의
interface OrderData {
  id: number;
  no: number;
  date: string;
  total: string;
  balance: string;
}

// 리듀서의 상태 및 액션 타입 정의
interface State {
  visibleData: OrderData[];
  loadedItems: number;
}

type Action = { type: "LOAD_MORE" };

interface HistoryTableProps {
  onSelectOrder: (order: OrderData) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({onSelectOrder}) => {
  const itemsPerPage = 10;

  // 동적으로 주문 데이터를 관리
  const [data, setData] = useState<OrderData[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // useReducer로 visibleData & loadedItems 상태 관리
  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "LOAD_MORE":
        return {
          visibleData: data.slice(0, state.loadedItems + itemsPerPage),
          loadedItems: state.loadedItems + itemsPerPage,
        };
      default:
        return state;
    }
  };

  // useReducer 초기 상태 설정
  const [state, dispatch] = useReducer(reducer, {
    visibleData: [],
    loadedItems: itemsPerPage,
  });

  // 주문 내역을 서버에서 가져오는 함수
  const getInvoices = async (id: number) => {
    try {
      const clientInvoice = await getInvoicesByClientId(id);
      setData((prevData) => [
        ...prevData,
        ...clientInvoice.invoices.map((invoice: OrderData) => ({
          id: invoice.id,
          no: invoice.no,
          date: invoice.date,
          total: invoice.total,
          balance: invoice.balance,
        })),
      ]);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    }
  };

  // 최초 실행 시 데이터 가져오기
  useEffect(() => {
    getInvoices(1);
  }, []);

  // 🔹 data가 변경될 때 visibleData 업데이트
  useEffect(() => {
    if (data.length > 0) {
      dispatch({type: "LOAD_MORE"});
    }
  }, [data]);

  // selectedOrder 기본값 설정 (초기 렌더 시 첫 번째 주문 자동 선택)
  useEffect(() => {
    if (data.length > 0 && !selectedOrder) {
      setSelectedOrder(data[0]);
    }
  }, [data, selectedOrder]);

  // Intersection Observer 설정 (무한 스크롤)
  useEffect(() => {
    if (!observerRef.current) return;

    const target = observerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && state.loadedItems < data.length) {
          setTimeout(() => {
            dispatch({type: "LOAD_MORE"});
          }, 500);
        }
      },
      {threshold: 1.0}
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [state.loadedItems, data.length]);

  // 주문 항목 클릭 시 실행
  const handleRowClick = (order: OrderData) => {
    setSelectedOrder(order);
    onSelectOrder(order);
  };

  return (
    <div className="table-container">
      <table className="order-table">
        <thead>
        <tr>
          <th>No</th>
          <th>구매 날짜</th>
          <th>합계 금액</th>
          <th>잔금</th>
          <th>상세</th>
        </tr>
        </thead>
        <tbody>
        {state.visibleData.map((order: OrderData) => ( // `order`의 타입 명시
          <tr
            key={order.no}
            className={selectedOrder?.no === order.no ? "selected-row" : ""}
            onClick={() => handleRowClick(order)}
          >
            <td className="no">{order.no}</td>
            <td className="date">{order.date}</td>
            <td className="total">{parseInt(order.total, 10).toLocaleString()}</td>
            <td className="balance">{parseInt(order.balance, 10).toLocaleString()}</td>
            <td>
              <button className="detail-button">수정 하기</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* 스크롤 감지를 위한 div */}
      <div ref={observerRef} className="observer-trigger"></div>
    </div>
  );
};

export default HistoryTable;
