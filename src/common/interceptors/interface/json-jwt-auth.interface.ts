export class JsonJwtAuthInterface {
  statusCode: number;
  message: string;
  cookieKey: ["access_token", "refresh_token"];
  cookieValue: string[];
}
