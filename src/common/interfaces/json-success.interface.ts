export interface JSON<T> {
  statusCode: number;
  message: string;
  result?: T;
}
