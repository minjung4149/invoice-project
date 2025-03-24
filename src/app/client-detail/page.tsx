import {Suspense} from "react";
import ClientDetail from "@/components/clientDetail/ClientDetail";

// SSR 페이지 - 클라이언트 컴포넌트를 Suspense로 감싸 렌더링
const ClientDetailPage = () => {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <ClientDetail/>
    </Suspense>
  );
};

export default ClientDetailPage;
