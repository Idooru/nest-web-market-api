export interface InquiryMediaCookieKey {
  request: {
    imageUrlCookie: string;
    videoUrlCookie: string;
  };
  response: {
    imageUrlCookie: string;
    videoUrlCookie: string;
  };
}

export const inquiryMediaCookieKey: InquiryMediaCookieKey = {
  request: {
    imageUrlCookie: "inquiry_request_image_url_cookie",
    videoUrlCookie: "inquiry_request_video_url_cookie",
  },
  response: {
    imageUrlCookie: "inquiry_response_image_url_cookie",
    videoUrlCookie: "inquiry_response_video_url_cookie",
  },
};
