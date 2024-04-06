export interface UserSelectProperty {
  userBase: string[];
  clientUser: string[];
  clientUserSimple: string[];
  clientUserProfile: string[];
  adminUser: string[];
  adminUserProfile: string[];
  whenAdminClientUser: string[];
}

export const userSelectProperty: UserSelectProperty = {
  userBase: ["user", "Profile", "Auth"],
  clientUser: ["user", "Profile", "Auth", "Client"],
  clientUserSimple: ["user", "Auth.nickname", "Auth.email"],
  clientUserProfile: [
    "user",
    "Profile",
    "Auth",
    "Account",
    "Client",
    "Cart",
    "CartProduct",
    "CartProductImage",
    "Order",
    "Payment",
    "PaymentProduct",
    "PaymentProductImage",
    "Review",
    "ReviewImage",
    "ReviewVideo",
    "InquiryRequest",
    "InquiryRequestImage",
    "InquiryRequestVideo",
    "InquiryResponse",
    "InquiryResponseImage",
    "InquiryResponseVideo",
  ],
  adminUser: ["user", "Profile", "Auth", "Admin"],
  adminUserProfile: [
    "user",
    "Profile",
    "Auth",
    "Account",
    "Admin",
    "Product",
    "ProductImage",
    "StarRate.averageScore",
    "Review",
    "ReviewImage",
    "ReviewVideo",
    "InquiryRequest",
    "InquiryRequestImage",
    "InquiryRequestVideo",
    "InquiryResponse",
    "InquiryResponseImage",
    "InquiryResponseVideo",
    "ReceivedInquiryRequest",
    "ReceivedInquiryRequestImage",
    "ReceivedInquiryRequestVideo",
  ],
  whenAdminClientUser: [
    "user",
    "Auth.nickname",
    "Auth.email",
    "Client",
    "Product",
    "ProductImage.url",
    "Review",
    "ReviewImage.url",
    "ReviewVideo.url",
    "InquiryRequest",
    "InquiryRequestImage.url",
    "InquiryRequestVideo.url",
  ],
};
