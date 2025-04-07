export interface ReviewSelect {
  reviews: string[];
  review: string[];
  reviewWithProducts: string[];
}

export const reviewSelect: ReviewSelect = {
  reviews: [
    "review.id as reviewId",
    "review.title as reviewTitle",
    "review.createdAt as reviewCreatedAt",
    "review.starRateScore as starRateScore",
    "review.countForModify as countForModify",
    "Product.id as productId",
    "Product.name as productName",
    "Product.price as productPrice",
    "Product.category as productCategory",
  ],
  review: [
    "review.id as reviewId",
    "review.title as reviewTitle",
    "review.content as reviewContent",
    "review.starRateScore as starRateScore",
    "review.countForModify as countForModify",
    "ReviewImage.url as reviewImageUrl",
    "ReviewVideo.url as reviewVideoUrl",
    "Product.id as productId",
    "Product.name as productName",
    "Product.price as productPrice",
    "Product.category as productCategory",
  ],
  reviewWithProducts: [
    "review.id as reviewId",
    "review.title as reviewTitle",
    "review.content as reviewContent",
    "review.starRateScore as starRateScore",
    "review.countForModify as countForModify",
  ],
};
