export interface InquirySelect {
  inquiryRequests: string[];
  inquiryRequest: string[];
  inquiryResponses: string[];
  inquiryResponse: string[];
  inquiryRequestFromAdminProduct: string[];
}

export const inquirySelect: InquirySelect = {
  inquiryRequests: [
    "inquiryRequest.id as inquiryRequestId",
    "inquiryRequest.inquiryOption as inquiryOption",
    "inquiryRequest.title as inquiryRequestTitle",
    "inquiryRequest.isAnswered as isAnswered",
    "inquiryRequest.createdAt as inquiryRequestCreatedAt",
    "Product.id as productId",
    "Product.name as productName",
    "Product.price as productPrice",
    "Product.category as productCategory",
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
    "inquiryResponse.id as inquiryResponseId",
    "inquiryResponse.title as inquiryResponseTitle",
    "inquiryResponse.createdAt as inquiryResponseCreatedAt",
    "Product.id as productId",
    "Product.name as productName",
    "Product.price as productPrice",
    "Product.category as productCategory",
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
    "inquiryRequest.createdAt AS inquiryRequestCreatedAt",
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
