export interface MediaSelect {
  productImages: string[];
  reviewImages: string[];
  reviewVideos: string[];
  inquiryRequestImages: string[];
  inquiryRequestVideos: string[];
  inquiryResponseImages: string[];
  inquiryResponseVideos: string[];
}

export const mediaSelect: MediaSelect = {
  productImages: [
    "productImage.id as productImageId",
    "productImage.url as productImageUrl",
    "productImage.size as productImageSize",
  ],
  reviewImages: [
    "reviewImage.id as reviewImageId",
    "reviewImage.url as reviewImageUrl",
    // "reviewImage.Review",
    "reviewImage.size as reviewImageSize",
  ],
  reviewVideos: [
    "reviewVideo.id as reviewVideoId",
    "reviewVideo.url as reviewVideoUrl",
    // "reviewVideo.Review",
    "reviewVideo.size as reviewVideoSize",
  ],
  inquiryRequestImages: [
    "inquiryRequestImage.id as inquiryRequestImageId",
    "inquiryRequestImage.url as inquiryRequestImageUrl",
    // "inquiryRequestImage.InquiryRequest",
    "inquiryRequestImage.size as inquiryRequestImageSize",
  ],
  inquiryRequestVideos: [
    "inquiryRequestVideo.id as inquiryRequestVideoId",
    "inquiryRequestVideo.url as inquiryRequestVideoUrl",
    // "inquiryRequestVideo.InquiryRequest",
    "inquiryRequestVideo.size as inquiryRequestVideoSize",
  ],
  inquiryResponseImages: [
    "inquiryResponseImage.id as inquiryResponseImageId",
    "inquiryResponseImage.url as inquiryResponseImageUrl",
    // "inquiryResponseImage.InquiryResponse",
    "inquiryResponseImage.size as inquiryResponseImageSize",
  ],
  inquiryResponseVideos: [
    "inquiryResponseVideo.id as inquiryResponseVideoId",
    "inquiryResponseVideo.url as inquiryResponseVideoUrl",
    // "inquiryResponseVideo.InquiryResponse",
    "inquiryResponseVideo.size as inquiryResponseVideoSize",
  ],
};
