import { UserRole } from "aws-sdk/clients/workmail";

export interface JwtAccessTokenPayload {
  userId: string;
  email?: string;
  nickName: string;
  userRole: UserRole;
}
