export interface IUserVerifyRepository {
  isExistUserId(userId: string): Promise<boolean>;
  isExistUserEmail(email: string): Promise<boolean>;
  isNotExistUserEmail(email: string): Promise<boolean>;
  isExistUserRealName(realname: string): Promise<boolean>;
  isNotExistUserNickName(nickname: string): Promise<boolean>;
  isExistUserPhoneNumber(phonenumber: string): Promise<boolean>;
  isNotExistUserPhoneNumber(phonenumber: string): Promise<boolean>;
}
