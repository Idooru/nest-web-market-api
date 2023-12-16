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
    "Auth.nickname",
    "Auth.email",
    "Client",
    "Cart",
    "Product",
    "ProductImage.url",
    "Review",
    "ReviewImage.url",
    "ReviewVideo.url",
    "InquiryRequest",
    "InquiryRequestImage.url",
    "InquiryRequestVideo.url",
    "InquiryResponse",
    "InquiryResponseImage.url",
    "InquiryResponseVideo.url",
  ],
  adminUser: ["user", "Profile", "Auth", "Admin"],
  adminUserProfile: [
    "user",
    "Profile.realname",
    "Profile.birth",
    "Profile.gender",
    "Profile.phonenumber",
    "Auth.nickname",
    "Auth.email",
    "Admin",
    "Product",
    "ProductImage.url",
    "StarRate.averageScore",
    "Review",
    "ReviewImage.url",
    "ReviewVideo.url",
    "InquiryRequest",
    "InquiryRequestImage.url",
    "InquiryRequestVideo.url",
    "InquiryResponse",
    "InquiryResponseImage.url",
    "InquiryResponseVideo.url",
    "ReceivedInquiryRequest",
    "ReceivedInquiryRequestImage.url",
    "ReceivedInquiryRequestVideo.url",
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
