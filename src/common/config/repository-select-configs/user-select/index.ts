export const userSelectProperty = {
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
    "Client.purchasedProduct",
    "Client.writtenReview",
    "Client.writtenInquiry",
    "Product",
    "ProductImage.url",
    "Review",
    "ReviewImage.url",
    "ReviewVideo.url",
    "Inquiry",
    "InquiryImage.url",
    "InquiryVideo.url",
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
    "Admin.receivedInquiry",
    "Inquiry",
    "InquiryImage.url",
    "InquiryVideo.url",
    "Product",
    "ProductImage.url",
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
    "Inquiry",
    "InquiryImage.url",
    "InquiryVideo.url",
  ],
};
