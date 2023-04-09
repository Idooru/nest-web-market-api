export interface UserVerifyCookieKey {
  is_exist: {
    id_executed: string;
    email_executed: string;
    realname_executed: string;
    phonenumber_executed: string;
  };
  is_not_exist: {
    email_executed: string;
    nickname_executed: string;
    phonenumber_executed: string;
  };
}

export const userVerifyCookieKey = {
  is_exist: {
    id_executed: "is_exist_user_id_executed",
    email_executed: "is_exist_user_email_executed",
    realname_executed: "is_exist_user_realname_executed",
    phonenumber_executed: "is_exist_user_phonenumber_executed",
  },
  is_not_exist: {
    email_executed: "is_not_exist_user_email_executed",
    nickname_executed: "is_not_exist_user_nickname_executed",
    phonenumber_executed: "is_not_exist_user_phonenumber_executed",
  },
};
