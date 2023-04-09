export const verifyCookieKeys = {
  product: {
    is_exist: {
      id_executed: "is_exist_product_id_executed",
    },
    is_not_exist: {
      name_executed: "is_not_exist_product_name_executed",
    },
  },
  user: {
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
  },
  review: {
    is_exist: { id_executed: "is_exist_review_id_executed" },
  },
  inquiry: {
    request: {
      is_exist: { id_executed: "is_exist_inquiry_request_id_executed" },
    },
    response: {
      is_exist: { id_executed: "is_exist_inquiry_response_id_executed" },
    },
  },
};
