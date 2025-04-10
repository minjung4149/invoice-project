"use client";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import {InvoiceData} from "@/types/common";
import {createInvoice} from "@/utils/api";
import {useRouter} from "next/navigation";

interface InvoiceTemplateProps {
  invoiceData: InvoiceData;
  clientName: string;
  isUpdated: boolean;
  onConfirmed?: () => void;
}

const InvoiceTemplate = ({invoiceData, clientName, isUpdated, onConfirmed}: InvoiceTemplateProps) => {
  const router = useRouter();
  // 확인 여부 상태 (제출 후 true)
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 소계 계산 (각 품목의 total 값을 숫자로 변환 후 합산)
  const subtotal = invoiceData.items.reduce((sum, item) => {
    return sum + (parseInt(item.total.replace(/,/g, ""), 10) || 0);
  }, 0);

  // getLatestInvoiceByClientId() 함수로 최신 Invoice 정보를 가져온다.
  const previousBalance = 0;

  // 합계 (소계 + 전잔금)
  const totalAmount = subtotal + previousBalance;

  // 잔액 (합계 - 입금)
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

      if (!invoiceNumber?.startsWith("INVOICE-")) {
        alert("올바른 계산서 번호 형식이 아닙니다.");
        return;
      }

      const [clientIdStr, invoiceNoStr] = invoiceNumber.replace("INVOICE-", "").split("-");
      const clientId = Number(clientIdStr);
      const invoiceNo = Number(invoiceNoStr);

      console.log("clientId:", clientId);
      console.log("invoiceNo:", invoiceNo);

      if (!clientId || !invoiceNo) {
        alert("올바른 계산서 번호 형식이 아닙니다.");
        return;
      }

      const payment = parseInt(invoiceData.payment.replace(/,/g, ""), 10) || 0;

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

      console.log("requestData 전송 직전:", JSON.stringify(requestData, null, 2));

      const response = await createInvoice(requestData);

      console.log("서버 응답:", response);
      setIsConfirmed(true);
      alert("확정 처리되었습니다.");
      if (onConfirmed) onConfirmed();
      // 페이지 이동 처리
      router.push(`/client-detail/order-history?name=${encodeURIComponent(clientName)}&id=${clientId}`);
    } catch (error) {
      alert("서버 요청 중 오류가 발생했습니다.");
      console.error("에러:", error);
    }
  };

  return (
    <>
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
    </>
  )
};

export default InvoiceTemplate;
