// public findProductEntityWithId(id: string): Promise<ProductEntity> {
//   return this.repository
//     .createQueryBuilder()
//     .select(this.select.product)
//     .from(ProductEntity, "product")
//     .leftJoin("product.Image", "Image")
//     .innerJoin("product.StarRate", "StarRate")
//     .leftJoin("product.Review", "Review")
//     .leftJoin("Review.reviewer", "Reviewer")
//     .leftJoin("Reviewer.User", "ReviewUser")
//     .leftJoin("ReviewUser.Auth", "ReviewAuth")
//     .leftJoin("Review.Image", "ReviewImage")
//     .leftJoin("Review.Video", "ReviewVideo")
//     .leftJoin("product.InquiryRequest", "InquiryRequest")
//     .leftJoin("InquiryRequest.InquiryRequester", "InquiryRequester")
//     .leftJoin("InquiryRequester.User", "InquiryUser")
//     .leftJoin("InquiryUser.Auth", "InquiryAuth")
//     .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
//     .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
//     .where("product.id = :id", { id })
//     .getOne();
// }
