export interface CartSelectProperty {
  carts: string[];
}

export const cartSelectProperty: CartSelectProperty = {
  carts: [
    "cart.id",
    "cart.Product",
    "cart.quantity",
    "cart.totalPrice",
    "Product",
    "Admin",
    "User",
    "Account.balance",
    "Image.url",
  ],
};
