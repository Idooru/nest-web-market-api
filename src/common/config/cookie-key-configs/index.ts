export const mediaCookieKeys = {
  product: {
    image_url_cookie: "product_image_url_cookie",
  },
  review: {
    image_url_cookie: "review_image_url_cookie",
    video_url_cookie: "review_video_url_cookie",
  },
  inquiry: {
    image_url_cookie: "inquiry_image_url_cookie",
    video_url_cookie: "inquiry_video_url_cookie",
  },
};

export const verifyCookieKeys = {
  product: {
    is_exist: {
      id_executed: "is-exist-product-id-executed",
    },
    is_not_exist: {
      name_executed: "is-not-exist-product-name-executed",
    },
  },
  user: {
    is_exist: {
      id_executed: "is-exist-user-id-executed",
      email_executed: "is-exist-user-email-executed",
      realname_executed: "is-exist-user-realname-executed",
      phonenumber_executed: "is-exist-user-phonenumber-executed",
    },
    is_not_exist: {
      email_executed: "is-not-exist-user-email-executed",
      nickname_executed: "is-not-exist-user-nickname-executed",
      phonenumber_executed: "is-not-exist-user-phonenumber-executed",
    },
  },
};
