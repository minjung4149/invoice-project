import {Suspense} from "react";
import ClientDetail from "@/components/clientDetail/ClientDetail";

const ClientDetailPage = () => {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <ClientDetail/>
    </Suspense>
  );
};

export default ClientDetailPage;
