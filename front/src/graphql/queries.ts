export const GET_PRODUCTS = `
query SearchProducts($term: String, $skip: Int, $take: Int) {
  search(
    input: {
      term: $term,
      groupByProduct: true,
      skip: $skip,
      take: $take }
  ) {
    totalItems
    items {
      productName
      productVariantId
      description
      productAsset {
        preview
      }
      priceWithTax {
        ... on SinglePrice {
          value
        }
        ... on PriceRange {
          min
          max
        }
      }
      currencyCode
    }
  }
}
`;
const ACTIVE_ORDER_FRAGMENT = /*GraphQL*/ `
fragment ActiveOrder on Order {
  __typename
  id
  code
  couponCodes
  state
  currencyCode
  totalQuantity
  subTotalWithTax
  shippingWithTax
  totalWithTax
  discounts {
    description
    amountWithTax
  }
  lines {
    id
    unitPriceWithTax
    quantity
    linePriceWithTax
    productVariant {
      id
      name
      sku
    }
    featuredAsset {
      id
      preview
    }
  }
  shippingLines {
    shippingMethod {
      description
    }
    priceWithTax
  }
}`;

export const GET_ACTIVE_ORDER = /*GraphQL*/ `
  query GetActiveOrder {
    activeOrder {
      ...ActiveOrder
    }
  }
  ${ACTIVE_ORDER_FRAGMENT}
`;

export const ADD_ITEM_TO_ORDER = /*GraphQL*/ `
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
      ... on InsufficientStockError {
        quantityAvailable
        order {
          ...ActiveOrder
        }
      }
    }
  }
  ${ACTIVE_ORDER_FRAGMENT}
`;
