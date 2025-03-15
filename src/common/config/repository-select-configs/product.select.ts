export interface ProductSelect {
  products: string[];
  product: string[];
  productImages: string[];
}

export const productSelect: ProductSelect = {
  products: [
    "product.id AS productId",
    "product.name AS productName",
    "product.price AS productPrice",
    "product.category as productCategory",
    "ANY_VALUE(Image.url) AS imageUrl",
    "ANY_VALUE(StarRate.averageScore) AS averageScore",
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
    "Image.url",
    "StarRate.id",
    "StarRate.averageScore",
    "Review",
    "Reviewer",
    "ReviewUser",
    "ReviewAuth.nickName",
    "ReviewImage.url",
    "ReviewVideo.url",
    "InquiryRequest",
    "InquiryRequester",
    "InquiryUser",
    "InquiryAuth.nickName",
    "InquiryRequestImage.url",
    "InquiryRequestVideo.url",
  ],
  productImages: ["productImage.id", "productImage.url", "productImage.uploader"],
};
