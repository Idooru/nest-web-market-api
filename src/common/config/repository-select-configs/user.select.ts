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
  clientUserSimple: ["user", "Auth.nickName", "Auth.email"],
  clientUserProfile: [
    "user",
    "Profile.realName",
    "Profile.birth",
    "Profile.gender",
    "Profile.phoneNumber",
    "Profile.address",
    "Auth.nickName",
    "Auth.email",
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
    "InquiryResponse",
  ],
  adminUser: ["user", "Profile", "Auth", "Admin"],
  adminUserProfile: [
    "user",
    "Profile.realName",
    "Profile.birth",
    "Profile.gender",
    "Profile.phoneNumber",
    "Profile.address",
    "Auth.nickName",
    "Auth.email",
    "Account",
    "AdminActions",
    "Product",
    "ProductImage",
    "StarRate.averageScore",
    "Review",
    "ReviewImage",
    "ReviewVideo",
    "InquiryRequest",
    "InquiryResponse",
    "ReceivedInquiryRequest",
  ],
  whenAdminClientUser: [
    "user",
    "Auth.nickName",
    "Auth.email",
    "Client",
    "Payment",
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
