"use client";
import {useState, useEffect, useCallback, useRef} from "react";
import {useSearchParams} from "next/navigation";
import HeaderDetail from "@/components/header/HeaderDetail";
import ClientInputForm from "@/components/clientDetail/ClientInputForm";
import InvoiceTemplate from "@/components/clientDetail/InvoiceTemplate";
import {getLatestInvoiceByClientId} from "@/utils/api";
import {InvoiceData} from "@/types/common";

// 클라이언트 컴포넌트
const ClientDetail = () => {
  const currentYear = new Date().getFullYear().toString();
  const searchParams = useSearchParams();

  // clientId, clientName 가져오기 (기본값 포함)
  const clientId = Number(searchParams.get("id")) || 1;
  const clientName = searchParams.get("name") || "Unknown Client";

  // invoiceData 상태 정의
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    year: currentYear,
    month: "",
    day: "",
    items: [],
    payment: "",
    note: "",
  });

  const [isUpdated, setIsUpdated] = useState(false);

  // 최신 인보이스 번호를 불러와 자동 생성
  const getInvoiceId = useCallback(async (clientId: number) => {
    try {
      const data = await getLatestInvoiceByClientId(clientId);
      const latestInvoice = data?.latestInvoice;

      // no가 숫자로 올 경우 그 값을 사용
      const latestNo = latestInvoice?.no ?? 0;

      const nextInvoiceNumber = `INVOICE-${clientId}-${latestNo + 1}`;

      setInvoiceData((prev) => ({...prev, invoiceNumber: nextInvoiceNumber}));

      console.log("생성된 번호:", nextInvoiceNumber);
    } catch {
      // 실패 시 기본값
      setInvoiceData((prev) => ({...prev, invoiceNumber: `INVOICE-${clientId}-1`}));
    }
  }, []);


  const getInvoiceIdRef = useRef(getInvoiceId);
  getInvoiceIdRef.current = getInvoiceId;

  // clientId 변경될 때 인보이스 정보 업데이트
  useEffect(() => {
    if (clientId) getInvoiceId(clientId);
  }, [clientId]);

  return (
    <>
      <HeaderDetail clientName={clientName} clientId={clientId}/>
      <main className="site-content">
        <div className="container">
          <div className="main-wrapper">
            <div className="layout-half" id="invoice">
              <div className="input-group">
                <ClientInputForm
                  invoiceData={invoiceData}
                  setInvoiceData={setInvoiceData}
                  setIsUpdated={setIsUpdated}
                />
              </div>
              <div className="viewer-group">
                <InvoiceTemplate
                  invoiceData={invoiceData}
                  clientName={clientName}
                  isUpdated={isUpdated}
                  // onConfirmed={() => getInvoiceIdRef.current(clientId)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ClientDetail;
