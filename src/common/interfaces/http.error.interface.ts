export class HttpError {
  statusCode: number;
  message: string[] | PromiseRejectedResult[];
  error: string;
}
