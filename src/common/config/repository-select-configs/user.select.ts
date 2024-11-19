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
    "Profile.realname",
    "Profile.birth",
    "Profile.gender",
    "Profile.phonenumber",
    "Profile.address",
    "Auth.nickname",
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
    "Profile.realname",
    "Profile.birth",
    "Profile.gender",
    "Profile.phonenumber",
    "Profile.address",
    "Auth.nickname",
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
    "Auth.nickname",
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
