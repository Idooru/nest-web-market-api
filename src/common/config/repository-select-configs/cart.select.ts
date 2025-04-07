export interface CartSelect {
  carts: string[];
}

export const cartSelect: CartSelect = {
  carts: [
    "cart.id as cartId",
    "cart.quantity as cartQuantity",
    "cart.totalPrice as cartTotalPrice",
    "cart.createdAt as cartCreatedAt",
    "Product.id as productId",
    "Product.name as productName",
    "Product.price as productPrice",
    "Product.category as productCategory",
    "GROUP_CONCAT(DISTINCT Image.url SEPARATOR ',') AS productImageUrls", // 여러 이미지 처리
  ],
};
