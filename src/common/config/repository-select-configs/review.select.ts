export interface ReviewSelect {
  review: string[];
  reviews: string[];
  starRate: string[];
}

export const reviewSelect: ReviewSelect = {
  review: ["review", "Product.id", "Product.name", "Product.price", "Product.category", "Image", "Video"],
  reviews: [
    "review.id",
    "review.title",
    "review.starRateScore",
    "review.countForModify",
    "Product.id",
    "Product.name",
    "Product.price",
    "Product.category",
    "Client",
  ],
  starRate: ["starRate"],
};
