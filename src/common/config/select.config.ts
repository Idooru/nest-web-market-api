export const returnPropertyWithSelect: ReturnPropertyWithSelect = {
  productsReturnProperty: [
    "product.name",
    "product.price",
    "product.type",
    "Image.url",
    "StarRating.averageScore",
    "Review",
    "Inquiry",
    "UserActivity.id",
  ],
  productReturnProperty: [
    "product.id",
    "product.name",
    "product.price",
    "product.origin",
    "product.type",
    "product.description",
    "Image.url",
    "StarRating.averageScore",
    "product.createdAt",
    "product.updatedAt",
    "Review",
    "Inquiry",
    "UserActivity.id",
    "ReviewImage.url",
    "ReviewVideo.url",
  ],
  productReturnWithStarRating: [
    "product.id",
    "product.name",
    "product.price",
    "product.origin",
    "product.type",
    "product.description",
    "Image.url",
    "StarRating.id",
    "StarRating.averageScore",
    "product.createdAt",
    "product.updatedAt",
  ],
  userInformationReturnProperty: [
    "Profile.realname",
    "Auth.nickname",
    "Profile.birth",
    "Profile.gender",
    "Auth.email",
    "Profile.phonenumber",
    "Auth.userType",
    "Activity.purchaseCount",
    "Activity.bonusPoint",
    "Activity.productInquiryCount",
    "Activity.productReviewCount",
  ],
};

type ReturnPropertyWithSelect = {
  productsReturnProperty: string[];
  productReturnProperty: string[];
  productReturnWithStarRating: string[];
  userInformationReturnProperty: string[];
};
