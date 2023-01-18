export class JsonSendCookieInterface<T> {
  statusCode: number;
  message: string;
  cookieKey: string;
  cookieValue: T;
}
