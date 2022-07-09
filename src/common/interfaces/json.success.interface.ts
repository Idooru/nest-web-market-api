export interface JSON<R> {
  statusCode: number;
  message: string;
  cookieKey?: string;
  cookieValue?: string | string[];
  result?: R;
}
