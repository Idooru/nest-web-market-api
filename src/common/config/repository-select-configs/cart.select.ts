export interface CartSelectProperty {
  carts: string[];
}

export const cartSelectProperty: CartSelectProperty = {
  carts: [
    "cart.id",
    "cart.Product",
    "cart.quantity",
    "cart.totalPrice",
    "Product.name",
    "Product.price",
    "Product.origin",
    "Product.category",
    "Image.url",
  ],
};
