import {Suspense} from "react";
import HeaderDetailClient from "@/components/header/HeaderDetailClient";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({children}: LayoutProps) => {
  return (
    <>
      <Suspense fallback={<p>로딩 중...</p>}>
        <HeaderDetailClient/>
      </Suspense>
      {children}
    </>
  );
};

export default Layout;
