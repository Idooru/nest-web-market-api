export interface UserSelectProperty {
  userBaseSelect: string[];
  clientUserSelect: string[];
  clientUserSimpleSelect: string[];
  clientUserProfileSelect: string[];
  adminUserSelect: string[];
  adminUserProfileSelect: string[];
  whenAdminSelectClientUser: string[];
}

export const userSelectProperty: UserSelectProperty = {
  userBaseSelect: ["user", "Profile", "Auth"],
  clientUserSelect: ["user", "Profile", "Auth", "Client"],
  clientUserSimpleSelect: ["user", "Auth.nickname", "Auth.email"],
  clientUserProfileSelect: [
    "user",
    "Profile.realname",
    "Profile.birth",
    "Profile.gender",
    "Profile.phonenumber",
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
    "InquiryResponse",
    "InquiryResponseImage.url",
    "InquiryResponseVideo.url",
  ],
  adminUserSelect: ["user", "Profile", "Auth", "Admin"],
  adminUserProfileSelect: [
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
  whenAdminSelectClientUser: [
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
