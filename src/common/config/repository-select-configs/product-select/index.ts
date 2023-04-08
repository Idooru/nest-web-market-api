export interface ProductSelectProperty {
  productsIdSelect: string[];
  productsSelect: string[];
  productSelect: string[];
  productSelectWhenNeedStarRate: string[];
}

export const productSelectProperty: ProductSelectProperty = {
  productsIdSelect: ["product.id", "product.name", "product.type"],
  productsSelect: [
    "product.name",
    "product.price",
    "product.type",
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
  productSelect: [
    "product.id",
    "product.name",
    "product.price",
    "product.origin",
    "product.type",
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
  productSelectWhenNeedStarRate: ["product", "StarRate.id"],
};
