export interface InquirySelect {
  inquiryRequests: string[];
  inquiryRequest: string[];
  inquiryResponses: string[];
  inquiryResponse: string[];
  inquiryRequestFromAdminProduct: string[];
}

export const inquirySelect: InquirySelect = {
  inquiryRequests: [
    "inquiryRequest.id",
    "inquiryRequest.title",
    "inquiryRequest.inquiryOption",
    "inquiryRequest.isAnswered",
    "Product.id",
    "Product.name",
    "Product.price",
    "Product.category",
  ],
  inquiryRequest: [
    "inquiryRequest",
    "InquiryRequestImage.url",
    "InquiryRequestVideo.url",
    "InquiryResponse",
    "InquiryResponseImage.url",
    "InquiryResponseVideo.url",
    "Product.id",
    "Product.name",
    "Product.price",
    "Product.category",
  ],
  inquiryResponses: [
    "inquiryResponse.id",
    "inquiryResponse.title",
    "inquiryResponse.inquiryOption",
    "InquiryRequest.id",
    "InquiryRequest.title",
    "InquiryRequest.inquiryOption",
    "InquiryRequest.isAnswered",
    "Product.id",
    "Product.name",
    "Product.price",
    "Product.category",
  ],
  inquiryResponse: [
    "inquiryResponse",
    "InquiryResponseImage.url",
    "InquiryResponseVideo.url",
    "InquiryRequest",
    "InquiryRequestImage.url",
    "InquiryRequestVideo.url",
    "Product.id",
    "Product.name",
    "Product.price",
    "Product.category",
  ],
  inquiryRequestFromAdminProduct: [
    "inquiryRequest.id AS inquiryRequestId",
    "inquiryRequest.title AS inquiryRequestTitle",
    "inquiryRequest.content AS inquiryRequestContent",
    "inquiryRequest.inquiryOption AS inquiryRequestOption",
    "inquiryRequest.isAnswered AS isAnsweredInquiryRequest",
    "ClientUser.id AS inquiryRequesterId",
    "User.role AS inquiryRequesterRole",
    "Auth.email AS inquiryRequesterEmail",
    "Auth.nickName AS inquiryRequesterNickName",
    "Product.id AS productId",
    "Product.name AS productName",
    "Product.price AS productPrice",
    "Product.category AS productCategory",
  ],
};
