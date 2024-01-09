import { Dispatch, FC, SetStateAction } from "react";
import { ADD_ITEM_TO_ORDER, GET_PRODUCTS } from "../graphql/queries";
import { AddItem, OrderPartial, ProductResult } from "../models";
import { query, useQuery } from "../client";
import { formatOrderPrice } from "../tools";

interface Props {
  setActiveOrder: Dispatch<SetStateAction<OrderPartial>>
}

export const ProductList: FC<Props> = ({ setActiveOrder }) => {
  const { data, loading, error } = useQuery(
    GET_PRODUCTS,
    {
      slug: '',
      skip: 0,
      take: 10,
    }
  );

  const addToOrder = async (addItem: AddItem) => {
    const result = await query(ADD_ITEM_TO_ORDER, {
      productVariantId: addItem.productVariantId,
      quantity: 1,
    });

    if (result.data.addItemToOrder.__typename !== 'Order') {
      // An error occurred!
      window.alert(result.data.addItemToOrder.message);
    } else {
      if (setActiveOrder) {
        setActiveOrder(result.data.addItemToOrder);
      }
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {data?.search?.items.map(({ productName, description, productAsset, priceWithTax, productVariantId }: ProductResult) => (
        <div key={productName} style={{ padding: 20 }}>
          <h3>{productName}</h3>
          <p>{description}</p>
          <p>Price: {formatOrderPrice(priceWithTax)}</p>
          <img
            src={`${productAsset.preview}?preset=tiny`}
            alt={productName}
          />
          <p>
            <button onClick={() => addToOrder({
              productName, description, productAsset, priceWithTax, productVariantId
            })}>Buy</button>
          </p>
        </div>
      ))}
    </div>
  )
}
