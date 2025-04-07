export interface ProductSelect {
  products: string[];
  product: string[];
}

export const productSelect: ProductSelect = {
  products: [
    "product.id AS productId",
    "product.name AS productName",
    "product.price AS productPrice",
    "product.category as productCategory",
    "product.createdAt as productCreatedAt",
    "GROUP_CONCAT(DISTINCT Image.url SEPARATOR ',') AS imageUrls", // 여러 이미지 처리
    "StarRate.averageScore AS averageScore",
    "COUNT(DISTINCT Review.id) AS reviewCount",
  ],
  product: [
    "product.id",
    "product.name",
    "product.price",
    "product.origin",
    "product.category",
    "product.description",
    "product.stock",
    "ProductImage.url",
    "StarRate.averageScore",
    "Review.id",
    "Review.title",
    "Review.content",
    "Review.starRateScore",
    "ReviewImage.url",
    "ReviewVideo.url",
    "Reviewer.id",
    "User.id",
    "Auth.nickName",
  ],
};
