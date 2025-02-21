export interface ProductSelectProperty {
  productsId: string[];
  products: string[];
  product: string[];
  productImages: string[];
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
    "ReviewAuth.nickName",
    "InquiryRequest",
    "InquiryRequestWriter",
    "InquiryUser",
    "InquiryAuth.nickName",
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
    "StarRate.id",
    "StarRate.averageScore",
    "Review",
    "Reviewer",
    "ReviewUser",
    "ReviewAuth.nickName",
    "ReviewImage.url",
    "ReviewVideo.url",
    "InquiryRequest",
    "InquiryRequestWriter",
    "InquiryUser",
    "InquiryAuth.nickName",
    "InquiryRequestImage.url",
    "InquiryRequestVideo.url",
  ],
  productImages: ["productImage.id", "productImage.url", "productImage.uploader"],
};
