export interface UserSelect {
  users: string[];
  profile: string[];
  whenAdminClientUser: string[];
}

export const userSelect: UserSelect = {
  users: [
    "user.id AS userId",
    "user.role AS role",
    "Auth.nickName as nickName",
    "Auth.email as email",
    "user.createdAt as createdAt",
  ],
  profile: [
    "user.id AS id",
    "user.role AS role",
    "Profile.realName as realName",
    "Profile.birth as birth",
    "Profile.gender as gender",
    "Profile.phoneNumber as phoneNumber",
    "Profile.address as address",
    "Auth.nickName as nickName",
    "Auth.email as email",
  ],
  whenAdminClientUser: [
    "user",
    "Profile.realName",
    "Profile.phoneNumber",
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
