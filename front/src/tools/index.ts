import { OrderPriceWithTax } from "../models"

export const formatPrice = (price?: number) => {
  if (price) {
    const strPrice = `${price}`
    return `$ ${strPrice.slice(0, -2)}.${strPrice.slice(-2)}`
  }
}

export const formatOrderPrice = (priceWithTax: OrderPriceWithTax) => {
  return formatPrice(priceWithTax.value) ||
  (priceWithTax.min === priceWithTax.max ?
    formatPrice(priceWithTax.min) :
    `${formatPrice(priceWithTax.min)} to ${formatPrice(priceWithTax.max)}`)
}