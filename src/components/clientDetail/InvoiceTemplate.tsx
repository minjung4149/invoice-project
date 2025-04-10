"use client";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import {InvoiceData} from "@/types/common";
import {createInvoice} from "@/utils/api";
import {useRouter} from "next/navigation";

interface InvoiceTemplateProps {
  invoiceData: InvoiceData; // 입력된 인보이스 정보
  clientName: string; // 거래처 이름
  isUpdated: boolean; // 반영 완료 여부
  onConfirmed?: () => void; // 확정 후 호출되는 콜백
}

/**
 * InvoiceTemplate 컴포넌트
 *
 * 사용자가 입력한 인보이스 데이터를 기반으로
 * 미리보기 테이블을 출력하고, '확정하기' 버튼을 통해 서버에 최종 제출하는 역할
 */
const InvoiceTemplate = ({invoiceData, clientName, isUpdated, onConfirmed}: InvoiceTemplateProps) => {
  const router = useRouter();
  // 확인 여부 상태 (제출 후 true)
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 소계 계산: 각 품목의 금액 합계
  const subtotal = invoiceData.items.reduce((sum, item) => {
    return sum + (parseInt(item.total.replace(/,/g, ""), 10) || 0);
  }, 0);

  // 이전 잔금 (기본값 0)
  const previousBalance = 0;

  // 총합 = 소계 + 이전 잔금
  const totalAmount = subtotal + previousBalance;

  // 잔금 = 총합 - 입금액
  const balance =
    totalAmount - (parseInt(invoiceData.payment.replace(/,/g, ""), 10) || 0);

  // 서버로 데이터 전송
  const handleConfirm = async () => {
    console.log("invoiceData:", invoiceData);

    if (!isUpdated) {
      alert("먼저 반영하기 버튼을 눌러주세요.");
      return;
    }

    try {
      const invoiceNumber = invoiceData.invoiceNumber;

      // 인보이스 번호 유효성 체크
      if (!invoiceNumber?.startsWith("INVOICE-")) {
        alert("올바른 계산서 번호 형식이 아닙니다.");
        return;
      }

      const [clientIdStr, invoiceNoStr] = invoiceNumber.replace("INVOICE-", "").split("-");
      const clientId = Number(clientIdStr);
      const invoiceNo = Number(invoiceNoStr);

      if (!clientId || !invoiceNo) {
        alert("올바른 계산서 번호 형식이 아닙니다.");
        return;
      }

      const payment = parseInt(invoiceData.payment.replace(/,/g, ""), 10) || 0;

      // 서버에 전송할 데이터 구성
      const requestData = {
        no: invoiceNo,
        clientId,
        balance,
        payment,
        details: invoiceData.items.map((item) => ({
          name: item.name,
          quantity: parseInt(item.quantity, 10),
          price: parseInt(item.price.toString().replace(/,/g, ""), 10),
        })),
      };

      // 서버에 인보이스 생성 요청
      await createInvoice(requestData);

      // 성공 처리
      setIsConfirmed(true);
      alert("확정 처리되었습니다.");
      if (onConfirmed) onConfirmed();

      // 주문 내역 페이지로 이동
      router.push(`/client-detail/order-history?name=${encodeURIComponent(clientName)}&id=${clientId}`);
    } catch (error) {
      alert("서버 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="invoice">
      <div className="action-buttons">
        <button
          className={isConfirmed ? "active" : "inactive"}
          onClick={handleConfirm}
        >
          <FontAwesomeIcon icon={faCircleCheck} className="icon"/>
          확정하기
        </button>
      </div>

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
        <tbody>
        {invoiceData.items.map((item, index) => (
          <tr key={index}>
            <td className="no">{index + 1}</td>
            <td className="name">{item.name}</td>
            <td className="quantity">{item.quantity}</td>
            <td className="price">{item.price ? item.price.toLocaleString() : "-"}</td>
            <td className="total">{item.total ? item.total.toLocaleString() : "-"}</td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* 구분선 */}
      <hr className="divider"/>

      {/* 거래 요약 */}
      <div className="invoice-summary">
        <p>
          <span>소계:</span>
          <span className="summary-value">{subtotal.toLocaleString()} 원</span>
        </p>
        <hr className="divider"/>
        <p>
          {/* Client의 balance */}
          <span>전잔금:</span>
          <span className="summary-value">{previousBalance.toLocaleString()} 원</span>
        </p>
        <hr className="divider"/>
        <p>
          <span>합계:</span>
          <span className="summary-value">{totalAmount.toLocaleString()} 원</span>
        </p>
        <hr className="divider"/>
        <p>
          <span>입금:</span>
          <span className="summary-value">
            {invoiceData.payment
              ? parseInt(invoiceData.payment.replace(/,/g, ""), 10).toLocaleString()
              : "0"}{" "}
            원
          </span>
        </p>
        <hr className="divider"/>
        <p>
          <span>잔금:</span>
          <span className="summary-value">{balance.toLocaleString()} 원</span>
        </p>
        <hr className="divider"/>
        <p>
          <span>비고:</span>
          <span className="summary-value">
            {invoiceData.note ? invoiceData.note : "-"}
          </span>
        </p>
      </div>
    </div>
  )
};

export default InvoiceTemplate;
