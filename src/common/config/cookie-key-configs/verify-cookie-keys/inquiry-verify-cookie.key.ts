export interface InquiryVerifyCookieKey {
  request: {
    is_exist: { id_executed: string };
  };
  response: {
    is_exist: { id_executed: string };
  };
}

export const inquiryVerifyCookieKey: InquiryVerifyCookieKey = {
  request: {
    is_exist: { id_executed: "is_exist_inquiry_request_id_executed" },
  },
  response: {
    is_exist: { id_executed: "is_exist_inquiry_response_id_executed" },
  },
};
