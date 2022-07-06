export interface JsonRes<T> {
  statusCode: number;
  message: string;
  result?: T;
}
