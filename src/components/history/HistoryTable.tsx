"use client";
import React, {useState, useEffect, useRef, useReducer} from "react";
import {useRouter} from "next/navigation";
import {getInvoicesByClientId} from "@/utils/api";

// 테이블에서만 사용하는 날짜 포맷터: "2025-04-09(수) 14:19"
const formatDateWithWeekday = (isoString: string) => {
  const date = new Date(isoString);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = weekdays[date.getDay()];
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}(${weekday}) ${hour}:${minute}`;
};

// 주문 데이터 타입 정의
interface OrderData {
  id: number;
  no: number;
  createDate: string;
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
  clientId: number;
  clientName: string;
  onSelectOrder: (order: OrderData) => void; // 주문 선택 시 부모로 전달되는 콜백
}

/**
 * HistoryTable 컴포넌트
 *
 * - 특정 거래처의 주문 내역 리스트를 테이블 형태로 출력
 * - 최신 주문 자동 선택
 * - 무한 스크롤로 점진적 데이터 로딩
 * - 주문 수정 버튼은 최신 주문에만 노출
 */
const HistoryTable = ({clientId, clientName, onSelectOrder}: HistoryTableProps) => {
  const router = useRouter();
  const itemsPerPage = 10;

  // 동적으로 주문 데이터를 관리
  const [data, setData] = useState<OrderData[]>([]); // 전체 주문 데이터
  const observerRef = useRef<HTMLDivElement | null>(null); // 인터섹션 감지를 위한 ref
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null); // 현재 선택된 주문

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

      console.log('clientInvoice', clientInvoice)
      setData(
        clientInvoice.invoices.map((invoice: OrderData) => ({
          id: invoice.id,
          no: invoice.no,
          createDate: invoice.createDate,
          total: invoice.total,
          balance: invoice.balance,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    }
  };

  // 최초 실행 시 데이터 가져오기
  useEffect(() => {
    getInvoices(clientId);
  }, [clientId]);

  // data가 변경될 때 visibleData 업데이트
  useEffect(() => {
    if (data.length > 0) {
      dispatch({type: "LOAD_MORE"});
    }
  }, [data]);

  // selectedOrder 기본값 설정 (초기 렌더 시 첫 번째 주문 자동 선택)
  useEffect(() => {
    if (data.length > 0 && !selectedOrder) {
      const latest = data[0];
      setSelectedOrder(latest);
      onSelectOrder(latest);
    }
  }, [data, selectedOrder, onSelectOrder]);


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

  // 최신 주문 ID를 구함
  const latestOrderId = data.reduce((latestId, current) => {
    return new Date(current.createDate) > new Date(data.find(d => d.id === latestId)?.createDate ?? '')
      ? current.id
      : latestId;
  }, data[0]?.id);

  return (
    <div className="table-container">
      <table className="order-table">
        <thead>
        <tr>
          <th>No</th>
          <th>구매 날짜</th>
          <th>구매 금액</th>
          <th>잔금</th>
          <th>상세</th>
        </tr>
        </thead>
        <tbody>
        {state.visibleData.map((order: OrderData, index: number) => ( // `order`의 타입 명시
          <tr
            key={`${order.id}-${order.no}-${index}`}
            className={selectedOrder?.id === order.id ? "selected-row" : ""}
            onClick={() => handleRowClick(order)}
          >
            <td className="no">{order.no}</td>
            <td className="date">{formatDateWithWeekday(order.createDate)}</td>
            <td className="total">{parseInt(order.total, 10).toLocaleString()}</td>
            <td className="balance">{parseInt(order.balance, 10).toLocaleString()}</td>
            <td>
              <button className="detail-button print">인쇄</button>
              {order.id === latestOrderId && (
                <button
                  className="detail-button edit ml-8"
                  onClick={() => {
                    router.push(
                      `/client-detail/edit-invoice?invoiceId=${order.id}&clientId=${clientId}&name=${encodeURIComponent(clientName)}`
                    );
                  }}
                >
                  수정
                </button>
              )}
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
