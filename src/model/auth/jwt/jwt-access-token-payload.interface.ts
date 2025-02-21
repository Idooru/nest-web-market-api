export interface JwtAccessTokenPayload {
  userId: string;
  email?: string;
  nickName: string;
  userRole: ["client", "admin"];
}
