export class JsonSendCookiesInterface<T> {
  statusCode: number;
  message: string;
  cookieKey: string;
  cookieValue: T[];
}
