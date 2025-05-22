import {Suspense} from "react";
import HeaderDetailClient from "@/components/header/HeaderDetailClient";
import PrintDirectionType from "@/components/common/PrintDirectionType";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({children}: LayoutProps) => {
  return (
    <>
      <PrintDirectionType type="landscape"/>
      <Suspense fallback={<p></p>}>
        <HeaderDetailClient/>
      </Suspense>
      {children}
    </>
  );
};

export default Layout;

