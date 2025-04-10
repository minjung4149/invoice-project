import {Suspense} from "react";
import EditInvoiceClient from "@/components/clientDetail/EditInvoiceClient";
import HeaderDetailClient from "@/components/header/HeaderDetailClient";

// dynamic rendering을 강제로 활성화 (SSR이 항상 실행되도록 설정)
export const dynamic = 'force-dynamic';

const EditInvoicePage = () => {
  return (
    <>
      <Suspense fallback={<p>헤더 로딩 중...</p>}>
        <HeaderDetailClient/>
      </Suspense>

      {/* 거래처 인보이스 수정용 컴포넌트 */}
      <Suspense fallback={<p>수정 페이지 로딩 중...</p>}>
        <EditInvoiceClient/>
      </Suspense>
    </>
  );
};

export default EditInvoicePage;
