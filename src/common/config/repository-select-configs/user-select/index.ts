export const userSelectProperty = {
  userSelect: ["user", "Profile", "Auth", "Activity"],
  userSelectWithActivityProperty: [
    "user",
    "Profile",
    "Auth",
    "Activity",
    "Review",
    "Inquiry",
  ],
  userProfileSelect: [
    "user",
    "Profile.realname",
    "Profile.birth",
    "Profile.gender",
    "Profile.phonenumber",
    "Auth.nickname",
    "Auth.email",
    "Auth.userType",
    "Activity.bonusPoint",
    "Activity.purchaseCount",
    "Activity.productInquiryCount",
    "Activity.productReviewCount",
    "Review",
    "Inquiry",
    "ReviewImage.url",
    "ReviewVideo.url",
    "InquiryImage.url",
    "InquiryVideo.url",
  ],
  userSimpleSelect: [
    "user",
    "user.id",
    "Auth.nickname",
    "Auth.email",
    "Auth.userType",
  ],
  userSelectWhoAdmin: [
    "user",
    "Auth.nickname",
    "Auth.email",
    "Auth.userType",
    "Activity.bonusPoint",
    "Activity.purchaseCount",
    "Activity.productInquiryCount",
    "Activity.productReviewCount",
    "Review",
    "Inquiry",
  ],
};
