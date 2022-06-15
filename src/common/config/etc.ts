import { CookieOptions } from "express";
import { UserEntity } from "../../model/user/entities/user.entity";
import { ResponseUserDto } from "../../model/user/dtos/response-user.dto";

export const CookieOption: CookieOptions = {
  httpOnly: true,
  signed: true,
  expires: new Date(Date.now() + 100000000000),
};

export const UserReturnFilter = (user: UserEntity): ResponseUserDto => ({
  id: user.id,
  realName: user.realName,
  nickName: user.nickName,
  birth: user.birth,
  gender: user.gender,
  email: user.email,
  phoneNumber: user.phoneNumber,
  userType: user.userType,
});
