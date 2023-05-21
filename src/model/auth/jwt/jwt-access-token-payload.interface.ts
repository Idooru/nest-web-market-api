export class JwtAccessTokenPayload {
  userId: string;
  email?: string;
  nickname: string;
  userRole: ["client", "admin"];
}
