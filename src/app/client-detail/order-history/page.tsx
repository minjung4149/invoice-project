import {Suspense} from 'react';
import OrderHistoryClient from "@/components/history/OrderHistoryClient";

const OrderHistoryPage = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <OrderHistoryClient/>
    </Suspense>
  );
};

export default OrderHistoryPage;