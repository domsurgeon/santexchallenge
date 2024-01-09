import { FC } from "react";
import { OrderPartial } from "../models";
import { formatPrice } from "../tools";

interface Props {
  activeOrder?: OrderPartial
}

export const Header:FC<Props> = ({ activeOrder }) => {
  return (
    <header style={{
      background: 'red',
      gridTemplateColumns: '1fr 1fr',
      display: 'grid',
      padding: 20,
      fontSize: '1.5rem',
    }}>
      <img
        src="https://santex.wpengine.com/wp-content/uploads/2019/02/logo-santex@3x.png"
        alt="logo"
      />
      <div>Purchase total: {formatPrice(activeOrder?.totalWithTax) || '-'}</div>
    </header>
  );
}
