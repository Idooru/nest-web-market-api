export interface JsonResult<T> {
  statusCode: number;
  message: string;
  result?: T;
}
