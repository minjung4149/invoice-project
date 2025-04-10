"use client";

import React, {useEffect, useState, useCallback, useRef} from "react";
import {useSearchParams} from "next/navigation";
import HeaderDetail from "@/components/header/HeaderDetail";
import ClientInputForm from "@/components/clientDetail/ClientInputForm";
import InvoiceTemplate from "@/components/clientDetail/InvoiceTemplate";
import {getInvoiceById} from "@/utils/api";
import {InvoiceData, InvoiceItem} from "@/types/common";

const EditInvoiceClient = () => {
  const searchParams = useSearchParams();

  const invoiceId = Number(searchParams.get("id"));
  const clientId = Number(searchParams.get("clientId") || 1);
  const clientName = searchParams.get("name") || "Unknown Client";

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    year: new Date().getFullYear().toString(),
    month: "",
    day: "",
    items: [],
    payment: "",
    note: "",
  });

  const [isUpdated, setIsUpdated] = useState(false);

  const fetchInvoice = useCallback(async (invoiceId: number) => {
    try {
      const data = await getInvoiceById(invoiceId);

      const items: InvoiceItem[] = (data.details || []).map((item: {
        name: string;
        quantity: number;
        price: number
      }) => ({
        name: item.name,
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        total: (item.quantity * item.price).toLocaleString(),
      }));

      const invoiceDate = new Date(data.createDate);

      const formData: InvoiceData = {
        invoiceNumber: `INVOICE-${clientId}-${data.no}`,
        year: invoiceDate.getFullYear().toString(),
        month: (invoiceDate.getMonth() + 1).toString().padStart(2, "0"),
        day: invoiceDate.getDate().toString().padStart(2, "0"),
        items,
        payment: data.payment.toLocaleString(),
        note: data.note || "",
      };

      setInvoiceData(formData);
    } catch (error) {
      console.error("수정용 인보이스 로딩 실패:", error);
    }
  }, [clientId]);

  const fetchInvoiceRef = useRef(fetchInvoice);
  fetchInvoiceRef.current = fetchInvoice;

  useEffect(() => {
    if (invoiceId) fetchInvoiceRef.current(invoiceId);
  }, [invoiceId]);

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
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default EditInvoiceClient;
