export interface MediaSelectProperty {
  productImagesSelect: string[];
  reviewImagesSelect: string[];
  reviewVideosSelect: string[];
  inquiryRequestImagesSelect: string[];
  inquiryRequestVideoesSelect: string[];
  inquiryResponseImagesSelect: string[];
  inquiryResponseVideosSelect: string[];
}

export const mediaSelectProperty: MediaSelectProperty = {
  productImagesSelect: [
    "productImage.id",
    "productImage.url",
    "productImage.uploader",
  ],
  reviewImagesSelect: [
    "reviewImage.id",
    "reviewImage.url",
    "reviewImage.Review",
    "reviewImage.uploader",
  ],
  reviewVideosSelect: [
    "reviewVideo.id",
    "reviewVideo.url",
    "reviewVideo.Review",
    "reviewVideo.uploader",
  ],
  inquiryRequestImagesSelect: [
    "inquiryRequestImage.id",
    "inquiryRequestImage.url",
    "inquiryRequestImage.InquiryRequest",
    "inquiryRequestImage.uploader",
  ],
  inquiryRequestVideoesSelect: [
    "inquiryRequestVideo.id",
    "inquiryRequestVideo.url",
    "inquiryRequestVideo.InquiryRequest",
    "inquiryRequestVideo.uploader",
  ],
  inquiryResponseImagesSelect: [
    "inquiryResponseImage.id",
    "inquiryResponseImage.url",
    "inquiryResponseImage.InquiryResponse",
    "inquiryResponseImage.uploader",
  ],
  inquiryResponseVideosSelect: [
    "inquiryResponseVideo.id",
    "inquiryResponseVideo.url",
    "inquiryResponseVideo.InquiryResponse",
    "inquiryResponseVideo.uploader",
  ],
};
