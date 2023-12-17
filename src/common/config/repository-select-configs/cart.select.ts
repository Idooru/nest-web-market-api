export interface CartSelectProperty {
  carts: string[];
}

export const cartSelectProperty: CartSelectProperty = {
  carts: [
    "cart.id",
    "cart.product",
    "cart.quantity",
    "cart.totalPrice",
    "cart.deliveryOption",
    "Product.name",
    "Product.price",
    "Product.origin",
    "Product.category",
    "Image.url",
  ],
};
