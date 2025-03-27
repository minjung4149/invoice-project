import React from 'react';
import BalanceTable from "@/components/balance/BalanceTable";
import HeaderHome from "@/components/header/HeaderHome";
import BalanceSummary from "@/components/balance/BalanceSummary";

const BalancePage = () => {
  return (
    <>
      <HeaderHome/>
      <main className="site-content">
        <div className="container">
          <div className="main-wrapper">
            <div className="balance-wrapper">
              <BalanceTable/>
              <BalanceSummary/>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default BalancePage;