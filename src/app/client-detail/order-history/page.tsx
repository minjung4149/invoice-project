'use client';

import {Suspense} from 'react';
import OrderHistoryClient from "@/components/history/OrderHistoryClient";
import HeaderDetailClient from "@/components/header/HeaderDetailClient";

export const dynamic = 'force-dynamic';

const OrderHistoryPage = () => {
  return (
    <>
      <HeaderDetailClient/>
      <Suspense fallback={<div>로딩 중...</div>}>
        <OrderHistoryClient/>
      </Suspense>
    </>
  );
};

export default OrderHistoryPage;
