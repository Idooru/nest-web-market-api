export interface ReviewSelectProperty {
  review: string[];
  reviews: string[];
  starRate: string[];
}

export const reviewSelectProperty = {
  review: ["review", "Product", "Image", "Video"],
  reviews: ["review", "Product", "Client", "Image", "Video"],
  starRate: ["starRate"],
};
