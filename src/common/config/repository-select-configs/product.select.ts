export interface ProductSelectProperty {
  productsId: string[];
  products: string[];
  product: string[];
  productWhenNeedStarRate: string[];
}

export const productSelectProperty: ProductSelectProperty = {
  productsId: ["product.id", "product.name", "product.category"],
  products: [
    "product.id",
    "product.name",
    "product.price",
    "product.category",
    "Image.url",
    "StarRate.averageScore",
    "Review",
    "Reviewer",
    "ReviewUser",
    "ReviewAuth.nickname",
    "InquiryRequest",
    "InquiryRequestWritter",
    "InquiryUser",
    "InquiryAuth.nickname",
  ],
  product: [
    "product.id",
    "product.name",
    "product.price",
    "product.origin",
    "product.category",
    "product.description",
    "product.quantity",
    "Image.url",
    "StarRate.averageScore",
    "Review",
    "Reviewer",
    "ReviewUser",
    "ReviewAuth.nickname",
    "ReviewImage.url",
    "ReviewVideo.url",
    "InquiryRequest",
    "InquiryRequestWritter",
    "InquiryUser",
    "InquiryAuth.nickname",
    "InquiryRequestImage.url",
    "InquiryRequestVideo.url",
  ],
  productWhenNeedStarRate: ["product", "StarRate.id"],
};
