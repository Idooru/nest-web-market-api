export interface InquiryMediaCookieKey {
  request: {
    image_url_cookie: string;
    video_url_cookie: string;
  };
  response: {
    image_url_cookie: string;
    video_url_cookie: string;
  };
}

export const inquiryMediaCookieKey: InquiryMediaCookieKey = {
  request: {
    image_url_cookie: "inquiry_request_image_url_cookie",
    video_url_cookie: "inquiry_request_video_url_cookie",
  },
  response: {
    image_url_cookie: "inquiry_response_image_url_cookie",
    video_url_cookie: "inquiry_response_video_url_cookie",
  },
};
