export interface UserSelect {
  userBase: string[];
  clientUser: string[];
  users: string[];
  adminUser: string[];
  profile: string[];
  whenAdminClientUser: string[];
}

export const userSelect: UserSelect = {
  userBase: ["user", "Profile", "Auth"],
  clientUser: ["user", "Profile", "Auth", "Client"],
  users: [
    "user.id AS userId",
    "user.role AS role",
    "Auth.nickName as nickName",
    "Auth.email as email",
    "user.createdAt as createdAt",
  ],
  adminUser: ["user", "Profile", "Auth", "Admin"],
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
