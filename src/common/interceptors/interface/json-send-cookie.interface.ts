export class JsonSendCookieInterface<T> {
  statusCode: number;
  message: string;
  cookieKey: string | string[];
  cookieValue: T | T[];
}
