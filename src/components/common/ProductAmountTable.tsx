import React from "react";

interface ProductRow {
  itemId: number;
  name: string;
  spec: string;
  quantity: number;
  amount: number;
}

interface TableProps {
  data: ProductRow[];
  amountLabel: string;
}

const ProductAmountTable = ({data, amountLabel}: TableProps) => {
  const filteredSorted = data
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="table-container">
      <table className="amount-table">
        <thead>
        <tr>
          <th>No</th>
          <th>품목</th>
          <th>규격</th>
          <th>수량</th>
          <th>{amountLabel}</th>
        </tr>
        </thead>
        <tbody>
        {filteredSorted.map(({itemId, name, spec, quantity, amount}, index) => (
          <tr key={itemId}>
            <td className="itemId">{index + 1}</td>
            <td className="name">{name}</td>
            <td className="spec">{spec}</td>
            <td className="quantity">{quantity.toLocaleString()}</td>
            <td className="amount">{amount.toLocaleString()} 원</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductAmountTable;
