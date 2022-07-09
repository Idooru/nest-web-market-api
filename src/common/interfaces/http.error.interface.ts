export interface HttpError {
  statusCode: number;
  message: string[] | PromiseRejectedResult[];
  error: string;
}
