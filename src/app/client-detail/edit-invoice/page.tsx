import {Suspense} from "react";
import EditInvoiceClient from "@/components/clientDetail/EditInvoiceClient";
import HeaderDetailClient from "@/components/header/HeaderDetailClient";

export const dynamic = 'force-dynamic';

const EditInvoicePage = () => {
  return (
    <>
      <Suspense fallback={<p>헤더 로딩 중...</p>}>
        <HeaderDetailClient/>
      </Suspense>

      <Suspense fallback={<p>수정 페이지 로딩 중...</p>}>
        <EditInvoiceClient/>
      </Suspense>
    </>
  );
};

export default EditInvoicePage;
