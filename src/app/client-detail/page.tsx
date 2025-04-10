import {Suspense} from "react";
import ClientDetail from "@/components/clientDetail/ClientDetail";
import HeaderDetailClient from "@/components/header/HeaderDetailClient";

// dynamic rendering을 강제로 활성화 (SSR이 항상 실행되도록 설정)
export const dynamic = 'force-dynamic';

const ClientDetailPage = () => {
  return (
    <>
      <Suspense fallback={<p>헤더 로딩 중...</p>}>
        <HeaderDetailClient/>
      </Suspense>

      {/* 거래처 인보이스 입력 & 미리보기 컴포넌트 */}
      <Suspense fallback={<p>로딩 중...</p>}>
        <ClientDetail/>
      </Suspense>
    </>
  );
};

export default ClientDetailPage;
