export interface ProductResult {
  productName: string,
  productVariantId: string,
  description: string,
  productAsset: {
    preview: string
  },
  priceWithTax: OrderPriceWithTax,
  currencyCode?: string
}

export interface OrderPriceWithTax {
  min?: number,
  max?: number,
  value?: number
}

export interface DataResponse {
  activeOrder?: OrderPartial
  search?: {
    items: ProductResult[]
  }
}

export interface DataError {
  message: string
}

export interface AddItem extends ProductResult {
}

export interface OrderPartial {
  id: string;
  totalQuantity: number;
  totalWithTax: number;
  currencyCode: string;
  lines: Array<{
    id: string;
    unitPriceWithTax: number;
    quantity: number;
    linePriceWithTax: number;
    featuredAsset: {
      id: string;
      preview: string;
    };
    productVariant: {
      id: string;
      name: string;
    };
  }>;
}
