import React from 'react';
import HeaderHome from "@/components/header/HeaderHome";
import ProductAmountSection from "@/components/common/ProductAmountSection";

const dummyProductData = [
  {
    itemId: 1,
    name: "사과",
    spec: "5kg",
    quantity: 120000,
    amount: 240000000000,
  },
  {
    itemId: 2,
    name: "바나나",
    spec: "3kg",
    quantity: 80,
    amount: 1600000,
  },
  {
    itemId: 3,
    name: "딸기",
    spec: "2kg",
    quantity: -5,
    amount: -50000,
  },
  {
    itemId: 4,
    name: "딸기",
    spec: "2kg",
    quantity: 50,
    amount: 1250000,
  },

];

const availableMonths = ["2025-05", "2025-04", "2025-03"];

const SalesMonthlyPage = async () => {
  return (
    <>
      <HeaderHome/>
      <main className="site-content">
        <div className="container">
          <ProductAmountSection data={dummyProductData} months={availableMonths} label="판매"/>
        </div>
      </main>
    </>
  );
};

export default SalesMonthlyPage;
