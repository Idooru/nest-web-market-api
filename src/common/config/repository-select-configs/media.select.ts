export interface MediaSelectProperty {
  productImages: string[];
  reviewImages: string[];
  reviewVideos: string[];
  inquiryRequestImages: string[];
  inquiryRequestVideos: string[];
  inquiryResponseImages: string[];
  inquiryResponseVideos: string[];
}

export const mediaSelectProperty: MediaSelectProperty = {
  productImages: ["productImage.id", "productImage.url", "productImage.size"],
  reviewImages: [
    "reviewImage.id",
    "reviewImage.url",
    "reviewImage.Review",
    "reviewImage.size",
  ],
  reviewVideos: [
    "reviewVideo.id",
    "reviewVideo.url",
    "reviewVideo.Review",
    "reviewVideo.size",
  ],
  inquiryRequestImages: [
    "inquiryRequestImage.id",
    "inquiryRequestImage.url",
    "inquiryRequestImage.InquiryRequest",
    "inquiryRequestImage.size",
  ],
  inquiryRequestVideos: [
    "inquiryRequestVideo.id",
    "inquiryRequestVideo.url",
    "inquiryRequestVideo.InquiryRequest",
    "inquiryRequestVideo.size",
  ],
  inquiryResponseImages: [
    "inquiryResponseImage.id",
    "inquiryResponseImage.url",
    "inquiryResponseImage.InquiryResponse",
    "inquiryResponseImage.size",
  ],
  inquiryResponseVideos: [
    "inquiryResponseVideo.id",
    "inquiryResponseVideo.url",
    "inquiryResponseVideo.InquiryResponse",
    "inquiryResponseVideo.size",
  ],
};
