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
  productImages: [
    "productImage.id",
    "productImage.url",
    "productImage.uploader",
  ],
  reviewImages: [
    "reviewImage.id",
    "reviewImage.url",
    "reviewImage.Review",
    "reviewImage.uploader",
  ],
  reviewVideos: [
    "reviewVideo.id",
    "reviewVideo.url",
    "reviewVideo.Review",
    "reviewVideo.uploader",
  ],
  inquiryRequestImages: [
    "inquiryRequestImage.id",
    "inquiryRequestImage.url",
    "inquiryRequestImage.InquiryRequest",
    "inquiryRequestImage.uploader",
  ],
  inquiryRequestVideos: [
    "inquiryRequestVideo.id",
    "inquiryRequestVideo.url",
    "inquiryRequestVideo.InquiryRequest",
    "inquiryRequestVideo.uploader",
  ],
  inquiryResponseImages: [
    "inquiryResponseImage.id",
    "inquiryResponseImage.url",
    "inquiryResponseImage.InquiryResponse",
    "inquiryResponseImage.uploader",
  ],
  inquiryResponseVideos: [
    "inquiryResponseVideo.id",
    "inquiryResponseVideo.url",
    "inquiryResponseVideo.InquiryResponse",
    "inquiryResponseVideo.uploader",
  ],
};
