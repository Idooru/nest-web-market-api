export interface OrderSelect {
  order: string[];
}

export const orderSelect: OrderSelect = {
  order: ["order", "Payment", "Product.id", "Product.name", "Product.price", "Product.category", "ProductImage.url"],
};
