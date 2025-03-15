export interface CartSelect {
  carts: string[];
}

export const cartSelect: CartSelect = {
  carts: [
    "cart.id",
    "cart.Product",
    "cart.quantity",
    "cart.totalPrice",
    "Product.id",
    "Product.name",
    "Product.price",
    "Product.origin",
    "Product.category",
    "Product.description",
    "AdminUser",
    "Image.url",
  ],
};
