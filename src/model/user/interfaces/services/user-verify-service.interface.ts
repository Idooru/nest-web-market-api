export interface IUserVerifyService {
  isExistUserId(id: string): Promise<void>;
  isExistUserEmail(email: string): Promise<void>;
  isNotExistUserEmail(email: string): Promise<void>;
  isExistUserRealName(realname: string): Promise<void>;
  isNotExistUserNickName(nickname: string): Promise<void>;
  isExistUserPhoneNumber(phonenumber: string): Promise<void>;
  isNotExistUserPhoneNumber(phonenumber: string): Promise<void>;
}
